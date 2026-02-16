// FAQ Page Data
const faqData = [
    {
        questionAr: "ما هي أجهزة الاختبار الكهربائية؟",
        questionEn: "What are electrical testing instruments?",
        answerAr: "أجهزة الاختبار الكهربائية هي أدوات متخصصة تستخدم لقياس وفحص الخصائص الكهربائية مثل الجهد والتيار والمقاومة والاستمرارية. نحن نوفر أجهزة من علامات تجارية رائدة مثل Fluke و Megger لضمان دقة القياسات وسلامة العمل.",
        answerEn: "Electrical testing instruments are specialized tools used to measure and test electrical properties such as voltage, current, resistance, and continuity. We provide instruments from leading brands like Fluke and Megger to ensure accurate measurements and work safety."
    },
    {
        questionAr: "كيف أختار جهاز الاختبار المناسب لاحتياجاتي؟",
        questionEn: "How do I choose the right testing instrument for my needs?",
        answerAr: "يعتمد اختيار جهاز الاختبار على نوع العمل الذي تقوم به. للاستخدام العام، نوصي بالملتيميتر الرقمي. للأعمال الصناعية، قد تحتاج إلى أجهزة متخصصة مثل أجهزة قياس العزل أو محللات الطاقة. فريقنا الفني متاح لمساعدتك في اختيار الجهاز المناسب - تواصل معنا عبر واتساب.",
        answerEn: "Choosing a testing instrument depends on the type of work you do. For general use, we recommend a digital multimeter. For industrial work, you may need specialized instruments like insulation testers or power analyzers. Our technical team is available to help you choose the right instrument - contact us via WhatsApp."
    },
    {
        questionAr: "هل المنتجات أصلية ومعتمدة؟",
        questionEn: "Are the products original and certified?",
        answerAr: "نعم، جميع منتجاتنا أصلية 100% ومستوردة مباشرة من الشركات المصنعة أو موزعيها المعتمدين. كل منتج يأتي مع شهادة الضمان الأصلية وشهادات المطابقة للمعايير الدولية والمصرية.",
        answerEn: "Yes, all our products are 100% original and imported directly from manufacturers or their authorized distributors. Each product comes with original warranty certificate and compliance certificates for international and Egyptian standards."
    },
    {
        questionAr: "ما هي مدة الضمان على المنتجات؟",
        questionEn: "What is the warranty period for products?",
        answerAr: "تختلف مدة الضمان حسب المنتج والشركة المصنعة. معظم المنتجات تأتي بضمان من سنة إلى 3 سنوات. نحن نوفر خدمة ما بعد البيع والدعم الفني طوال فترة الضمان وما بعدها.",
        answerEn: "Warranty period varies by product and manufacturer. Most products come with 1 to 3 years warranty. We provide after-sales service and technical support throughout the warranty period and beyond."
    },
    {
        questionAr: "هل تقدمون خدمة التوصيل؟",
        questionEn: "Do you provide delivery service?",
        answerAr: "نعم، نوفر خدمة التوصيل لجميع أنحاء مصر. تكلفة الشحن تعتمد على الموقع وحجم الطلب. للطلبات الكبيرة، نوفر شحن مجاني. تواصل معنا للحصول على عرض سعر شامل التوصيل.",
        answerEn: "Yes, we provide delivery service to all parts of Egypt. Shipping cost depends on location and order size. For large orders, we offer free shipping. Contact us for a quote including delivery."
    },
    {
        questionAr: "هل يمكنني الحصول على تدريب على استخدام الأجهزة؟",
        questionEn: "Can I get training on using the instruments?",
        answerAr: "نعم، نوفر تدريب فني على استخدام الأجهزة للعملاء. يشمل التدريب شرح وظائف الجهاز، طرق الاستخدام الصحيحة، وإجراءات السلامة. التدريب متاح في موقعنا أو في موقع العميل للطلبات الكبيرة.",
        answerEn: "Yes, we provide technical training on using the instruments for customers. Training includes device functions explanation, proper usage methods, and safety procedures. Training is available at our location or at customer site for large orders."
    },
    {
        questionAr: "ما هي معدات الحماية الشخصية (PPE) التي أحتاجها؟",
        questionEn: "What Personal Protective Equipment (PPE) do I need?",
        answerAr: "تعتمد معدات الحماية الشخصية المطلوبة على نوع العمل ومستوى الجهد. للأعمال الكهربائية العامة، تحتاج إلى: قفازات عازلة، نظارات واقية، خوذة، وأحذية السلامة. للجهد العالي، قد تحتاج إلى معدات إضافية. نحن نوفر جميع أنواع معدات الحماية المعتمدة.",
        answerEn: "Required PPE depends on work type and voltage level. For general electrical work, you need: insulated gloves, safety glasses, helmet, and safety shoes. For high voltage, you may need additional equipment. We provide all types of certified protective equipment."
    },
    {
        questionAr: "كيف يمكنني طلب عرض سعر؟",
        questionEn: "How can I request a quote?",
        answerAr: "يمكنك طلب عرض سعر بعدة طرق: 1) استخدام نموذج الطلب في صفحة المنتج، 2) التواصل معنا عبر واتساب، 3) الاتصال بنا على أرقام الهاتف الموضحة في الموقع، 4) إرسال بريد إلكتروني. سنرد عليك خلال 24 ساعة بعرض سعر مفصل.",
        answerEn: "You can request a quote in several ways: 1) Use the request form on the product page, 2) Contact us via WhatsApp, 3) Call us on the phone numbers shown on the site, 4) Send an email. We will respond within 24 hours with a detailed quote."
    },
    {
        questionAr: "هل تقدمون خدمات الصيانة والمعايرة؟",
        questionEn: "Do you provide maintenance and calibration services?",
        answerAr: "نعم، نوفر خدمات الصيانة والمعايرة لجميع أجهزة الاختبار. المعايرة تتم وفقاً للمعايير الدولية مع إصدار شهادة معايرة معتمدة. نوصي بإجراء المعايرة الدورية كل 6-12 شهر للحفاظ على دقة القياسات.",
        answerEn: "Yes, we provide maintenance and calibration services for all testing instruments. Calibration is performed according to international standards with certified calibration certificate. We recommend periodic calibration every 6-12 months to maintain measurement accuracy."
    },
    {
        questionAr: "ما هي طرق الدفع المتاحة؟",
        questionEn: "What payment methods are available?",
        answerAr: "نقبل عدة طرق للدفع: الدفع نقداً عند الاستلام، التحويل البنكي، والدفع الإلكتروني. للشركات والمؤسسات، نوفر نظام فواتير وآجال دفع حسب الاتفاق. تواصل معنا لمعرفة التفاصيل.",
        answerEn: "We accept several payment methods: Cash on delivery, bank transfer, and electronic payment. For companies and institutions, we provide invoicing system and payment terms as agreed. Contact us for details."
    }
];
