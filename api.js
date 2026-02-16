const API_BASE_URL = 'https://oracleapex.com/ords/learnz121';

/**
 * API Security Note:
 * All fetch calls are READ-ONLY (GET requests).
 * No POST/PUT/DELETE methods are implemented in this client-side code.
 * No sensitive API keys are stored in the frontend.
 */
const ENDPOINTS = {
    categories: `${API_BASE_URL}/categories/?limit=1000`,
    sub_categories: `${API_BASE_URL}/sub_categories/?limit=1000`,
    providers: `${API_BASE_URL}/providers/?limit=1000`,
    products: `${API_BASE_URL}/products/?limit=1000`,
    product_specs: `${API_BASE_URL}/product_specs/?limit=1000`,
    product_images: `${API_BASE_URL}/product_images/?limit=1000`,
    services: `${API_BASE_URL}/services/?limit=1000`,
    company_info: `${API_BASE_URL}/company_info/?limit=1000`,
    clients: `${API_BASE_URL}/clients/?limit=1000`
};

/**
 * Fetches data from a single endpoint.
 * @param {string} url 
 * @returns {Promise<any>}
 */
async function fetchEndpoint(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        const data = json.items != null ? json.items : json;
        return Array.isArray(data) ? data : (data && typeof data === 'object' ? [data] : []);
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return [];
    }
}

/**
 * Transforms snake_case keys to camelCase.
 * @param {object} data 
 * @returns {object}
 */
function toCamelCase(data) {
    if (Array.isArray(data)) {
        return data.map(item => toCamelCase(item));
    } else if (data !== null && typeof data === 'object') {
        return Object.keys(data).reduce((acc, key) => {
            // Convert snake_case (any case) to camelCase
            const camelKey = key.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            acc[camelKey] = toCamelCase(data[key]);
            return acc;
        }, {});
    }
    return data;
}

/**
 * Fetches all application data and structures it.
 * @returns {Promise<object>}
 */
async function fetchAppData() {
    try {
        const [
            categories,
            subCategoriesRaw,
            providers,
            products,
            productSpecs,
            productImages,
            services,
            companyInfoList,
            clients
        ] = await Promise.all([
            fetchEndpoint(ENDPOINTS.categories),
            fetchEndpoint(ENDPOINTS.sub_categories),
            fetchEndpoint(ENDPOINTS.providers),
            fetchEndpoint(ENDPOINTS.products),
            fetchEndpoint(ENDPOINTS.product_specs),
            fetchEndpoint(ENDPOINTS.product_images),
            fetchEndpoint(ENDPOINTS.services),
            fetchEndpoint(ENDPOINTS.company_info),
            fetchEndpoint(ENDPOINTS.clients)
        ]);

        const safeArray = (x) => (Array.isArray(x) ? x : []);
        const safeToCamel = (x) => (Array.isArray(toCamelCase(x)) ? toCamelCase(x) : []);

        // Transform basic data to camelCase
        const cleanCategories = safeToCamel(safeArray(categories)).map(c => ({
            ...c,
            image: c.imageUrl // Map imageUrl to image
        }));
        const cleanSubCategories = safeToCamel(safeArray(subCategoriesRaw)).map(s => ({
            ...s,
            image: s.imageUrl
        }));
        const cleanProviders = safeToCamel(safeArray(providers)).map(p => ({
            ...p,
            logo: p.imageUrl || p.IMAGE_URL, // Map imageUrl to logo (handle both cases)
            isFeatured: p.isFeatured == 1, // Loose equality
            isTrustedPartner: (p.isTrustedPartner == 1) || (p.is_trusted_partner == 1) || (p.IS_TRUSTED_PARTNER == 1) // Check all casings and use loose equality
        }));
        let cleanProducts = safeToCamel(safeArray(products)).map(p => ({
            ...p,
            mainImage: p.mainImageUrl, // Map mainImageUrl to mainImage
            subCategoryId: p.subCategoryId ?? p.sub_category_id ?? null
        }));
        const cleanSpecs = safeToCamel(safeArray(productSpecs));
        const cleanImages = safeToCamel(safeArray(productImages));
        const cleanServices = safeToCamel(safeArray(services));
        const cleanCompanyInfo = toCamelCase(companyInfoList[0] || {}); // Assuming single record for company info

        // Extra robustness for clients (handle case-sensitive Oracle APEX keys)
        const cleanClients = safeToCamel(safeArray(clients)).map(c => ({
            ...c,
            logo: c.logoUrl || c.logo || c.logo_url || c.LOGO_URL,
            website: c.websiteUrl || c.website || c.website_url || c.WEBSITE_URL,
            displayOrder: Number(c.displayOrder || c.display_order || c.DISPLAY_ORDER || 0)
        })).sort((a, b) => a.displayOrder - b.displayOrder);

        // Join products with specs and images
        cleanProducts = cleanProducts.map(product => {
            const specs = cleanSpecs.filter(spec => spec.productId === product.id);
            const subImages = cleanImages
                .filter(img => img.productId === product.id)
                .map(img => img.imageUrl);

            return {
                ...product,
                specifications: specs,
                subImages: subImages
            };
        });

        // Construct the final appData object
        return {
            categories: cleanCategories,
            subCategories: cleanSubCategories,
            providers: cleanProviders,
            products: cleanProducts,
            services: cleanServices,
            companyInfo: cleanCompanyInfo,
            clients: cleanClients
        };

    } catch (error) {
        console.error("Failed to fetch app data:", error);
        throw error;
    }
}
