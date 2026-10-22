import { WelfareScheme } from "../types/yojana";

export const VERIFIED_WELFARE_SCHEMES: WelfareScheme[] = [
  {
    id: "pmksy-micro-irrigation",
    code: "PMKSY-PDMC",
    name: "Pradhan Mantri Krishi Sinchayee Yojana (Per Drop More Crop)",
    sector: "Agriculture",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    jurisdiction: "Central & State Joint Scheme",
    category: "Irrigation & Solar",
    annual_benefit_inr: "Up to 55%–80% Drip Irrigation Subsidy",
    benefit_summary:
      "Provides 55% central grant (topped up to 80% via Maharashtra MahaDBT for small and marginal farmers) to install BIS-certified Drip and Sprinkler irrigation systems, cutting farm water usage in half.",
    required_documents: [
      "Aadhaar Card",
      "7/12 Extract (Satbara)",
      "8A Land Record",
      "Bank Passbook",
      "Authorized Dealer GST Quote"
    ],
    application_channel: "MahaDBT Farmer Portal",
    official_portal: "https://mahadbt.maharashtra.gov.in/Farmer/Login/Login",
    rules: {
      min_age: 18,
      allowed_states: ["all"],
      requires_farmer: true,
      requires_land_ownership: true,
      min_land_hectares: 0.1,
      max_land_hectares: 5.0,
      allowed_tenure_types: ["owner"],
      allowed_irrigation_types: ["borewell_drip", "canal", "rainfed"]
    },
    translations: {
      hindi: {
        name: "प्रधानमंत्री कृषि सिंचाई योजना (प्रति बूंद अधिक फसल)",
        sectorLabel: "कृषि एवं सिंचाई",
        benefitHighlight: "ड्रिप सिंचाई पर 55% से 80% तक सब्सिडी",
        summary:
          "छोटे और सीमांत किसानों को अपने खेत में BIS-प्रमाणित ड्रिप और स्प्रिंकलर सिंचाई सिस्टम लगाने के लिए 55% से 80% तक सीधा सरकारी अनुदान मिलता है।",
        documents: ["आधार कार्ड", "7/12 भूमि उतारा", "8-अ खाता नकल", "बैंक पासबुक", "डीलर कोटेशन"]
      },
      marathi: {
        name: "प्रधानमंत्री कृषी सिंचन योजना (ठिबक व तुषार सिंचन अनुदान)",
        sectorLabel: "कृषी व सिंचन",
        benefitHighlight: "ठिबक सिंचनावर ५५% ते ८०% शासकीय अनुदान",
        summary:
          "अल्प व अत्यल्प भूधारक शेतकऱ्यांना शेतात ठिबक किंवा तुषार सिंचन संच बसवण्यासाठी महाडीबीटी अंतर्गत ५५% ते ८०% पर्यंत थेट बँक खात्यात अनुदान मिळते.",
        documents: ["आधार कार्ड", "७/१२ उतारा", "८-अ उतारा", "बँक पासबुक", "अधिकृत विक्रेता GST बिल"]
      }
    }
  },
  {
    id: "pm-kisan",
    code: "PM-KISAN",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    sector: "Agriculture",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    jurisdiction: "Central Government",
    category: "Direct Income Support",
    annual_benefit_inr: "₹6,000 / year via DBT",
    benefit_summary:
      "Direct income support of ₹6,000 per year transferred in three equal installments of ₹2,000 every four months directly into the Aadhaar-seeded bank accounts of landowning farmer families.",
    required_documents: [
      "Aadhaar Card",
      "7/12 Extract (Satbara)",
      "Bank Passbook (DBT Enabled)",
      "Mobile Linked to Aadhaar"
    ],
    application_channel: "PM-KISAN Official Portal",
    official_portal: "https://pmkisan.gov.in",
    rules: {
      min_age: 18,
      max_annual_income: 250000,
      allowed_states: ["all"],
      requires_farmer: true,
      requires_land_ownership: true,
      min_land_hectares: 0.01,
      allowed_tenure_types: ["owner"]
    },
    translations: {
      hindi: {
        name: "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)",
        sectorLabel: "कृषि आय सहायता",
        benefitHighlight: "₹6,000 / वर्ष (DBT द्वारा सीधे बैंक खाते में)",
        summary:
          "भूमिधारक किसान परिवारों को बीज और खाद की जरूरतों के लिए हर साल ₹6,000 की आर्थिक सहायता ₹2,000 की तीन समान किस्तों में सीधे बैंक खाते में मिलती है।",
        documents: ["आधार कार्ड", "7/12 भूमि रिकॉर्ड", "बैंक पासबुक (DBT सक्रिय)", "मोबाइल नंबर"]
      },
      marathi: {
        name: "प्रधानमंत्री किसान सन्मान निधी (PM-KISAN)",
        sectorLabel: "कृषी उत्पन्न सहाय्य",
        benefitHighlight: "₹६,००० / वर्ष (DBT द्वारे थेट खात्यात)",
        summary:
          "शेतकरी कुटुंबांना शेतीच्या कामासाठी दरवर्षी ₹६,००० आर्थिक मदत (₹२,००० चे तीन हप्ते) थेट आधार संलग्न बँक खात्यात जमा केली जाते.",
        documents: ["आधार कार्ड", "७/१२ उतारा", "बँक पासबुक (DBT सुरू)", "मोबाईल क्रमांक"]
      }
    }
  },
  {
    id: "namo-shetkari",
    code: "MH-NSMNY",
    name: "Namo Shetkari Mahasanman Nidhi Yojana",
    sector: "Agriculture",
    ministry: "Department of Agriculture, Govt of Maharashtra",
    jurisdiction: "Maharashtra State",
    category: "Direct Income Support",
    annual_benefit_inr: "₹6,000 / year State Top-Up via DBT",
    benefit_summary:
      "Provides an additional ₹6,000 per year from the Government of Maharashtra on top of PM-KISAN, doubling total direct annual support to ₹12,000 per year for eligible Maharashtra farmers.",
    required_documents: [
      "Aadhaar Card",
      "Maharashtra 7/12 Extract",
      "PM-KISAN Registration ID",
      "Bank Passbook"
    ],
    application_channel: "Maharashtra Agriculture Portal",
    official_portal: "https://nsmny.mahait.org",
    rules: {
      min_age: 18,
      max_annual_income: 250000,
      allowed_states: ["Maharashtra"],
      requires_farmer: true,
      requires_land_ownership: true,
      min_land_hectares: 0.01,
      allowed_tenure_types: ["owner"]
    },
    translations: {
      hindi: {
        name: "नमो शेतकरी महासन्मान निधि योजना (महाराष्ट्र)",
        sectorLabel: "कृषि आय सहायता",
        benefitHighlight: "₹6,000 / वर्ष अतिरिक्त राज्य सहायता (कुल ₹12,000/वर्ष)",
        summary:
          "महाराष्ट्र के किसानों को पीएम-किसान के ₹6,000 के अलावा राज्य सरकार की ओर से ₹6,000 प्रति वर्ष अतिरिक्त मिलते हैं, जिससे कुल सहायता ₹12,000 हो जाती है।",
        documents: ["आधार कार्ड", "महाराष्ट्र 7/12 उतारा", "PM-KISAN पंजीकरण संख्या", "बैंक पासबुक"]
      },
      marathi: {
        name: "नमो शेतकरी महासन्मान निधी योजना",
        sectorLabel: "कृषी उत्पन्न सहाय्य",
        benefitHighlight: "₹६,००० / वर्ष अतिरिक्त राज्य निधी (एकूण ₹१२,०००/वर्ष)",
        summary:
          "महाराष्ट्रातील पात्र शेतकऱ्यांना पीएम-किसानच्या ₹६,००० व्यतिरिक्त राज्य शासनाकडून वर्षाला आणखी ₹६,००० थेट बँक खात्यात मिळतात.",
        documents: ["आधार कार्ड", "महाराष्ट्र ७/१२ उतारा", "PM-KISAN नोंदणी क्रमांक", "बँक पासबुक"]
      }
    }
  },
  {
    id: "pm-kusum-solar",
    code: "PM-KUSUM",
    name: "PM-KUSUM / Magel Tyala Saur Krushi Pump Yojana",
    sector: "Agriculture",
    ministry: "Ministry of New & Renewable Energy",
    jurisdiction: "Central & Maharashtra Energy Dept",
    category: "Irrigation & Solar",
    annual_benefit_inr: "90% to 95% Solar Pump Subsidy",
    benefit_summary:
      "Grants standalone 3 HP to 7.5 HP solar agricultural water pumps with up to 90%–95% government subsidy so farmers have reliable daytime irrigation without electricity bills or diesel costs.",
    required_documents: [
      "Aadhaar Card",
      "7/12 Extract with Water Source",
      "Bank Passbook",
      "Passport Photo"
    ],
    application_channel: "Mahavitaran Saur Krushi Portal",
    official_portal: "https://kusum.mahaurja.com",
    rules: {
      min_age: 18,
      allowed_states: ["all"],
      requires_farmer: true,
      requires_land_ownership: true,
      min_land_hectares: 0.2,
      max_land_hectares: 5.0,
      allowed_tenure_types: ["owner"],
      allowed_irrigation_types: ["rainfed", "borewell_drip"]
    },
    translations: {
      hindi: {
        name: "पीएम-कुसुम / मागेल त्याला सौर कृषी पंप योजना",
        sectorLabel: "कृषि एवं सौर ऊर्जा",
        benefitHighlight: "सोलर कृषि पंप पर 90% से 95% सब्सिडी",
        summary:
          "किसानों को दिन के समय सिंचाई के लिए 3 HP से 7.5 HP के सोलर वाटर पंप पर 90% से 95% तक सरकारी अनुदान दिया जाता है, केवल 5%-10% हिस्सा किसान को देना होता है।",
        documents: ["आधार कार्ड", "7/12 उतारा (जल स्रोत सहित)", "बैंक पासबुक", "पासपोर्ट फोटो"]
      },
      marathi: {
        name: "मागेल त्याला सौर कृषी पंप योजना (PM-KUSUM)",
        sectorLabel: "कृषी व सौर ऊर्जा",
        benefitHighlight: "सौर कृषी पंपावर ९०% ते ९५% शासकीय अनुदान",
        summary:
          "शेतकऱ्यांना दिवसा सिंचनासाठी ३ ते ७.५ एचपी सौर कृषी पंप बसवण्यासाठी ९०% ते ९५% अनुदान मिळते; शेतकऱ्यांना फक्त ५% ते १०% हिस्सा भरावा लागतो.",
        documents: ["आधार कार्ड", "७/१२ उतारा (पाण्याच्या स्रोताची नोंद)", "बँक पासबुक", "पासपोर्ट फोटो"]
      }
    }
  },
  {
    id: "pmfby-crop-insurance",
    code: "PMFBY",
    name: "Pradhan Mantri Fasal Bima Yojana (₹1 Crop Insurance)",
    sector: "Agriculture",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    jurisdiction: "Central & State Government",
    category: "Crop Insurance & Credit",
    annual_benefit_inr: "Full Crop Loss Cover at ₹1 Premium",
    benefit_summary:
      "Protects both landowner and tenant farmers against crop failure from drought, unseasonal rains, or pests. In Maharashtra, the state pays the farmer's share so enrollment costs just ₹1.",
    required_documents: [
      "Aadhaar Card",
      "7/12 Extract or Tenancy Agreement",
      "E-Peek Pahani Sowing Record",
      "Bank Passbook"
    ],
    application_channel: "PMFBY National Portal",
    official_portal: "https://pmfby.gov.in",
    rules: {
      min_age: 18,
      allowed_states: ["all"],
      requires_farmer: true,
      allowed_tenure_types: ["owner", "tenant"]
    },
    translations: {
      hindi: {
        name: "प्रधानमंत्री फसल बीमा योजना (₹1 फसल बीमा)",
        sectorLabel: "कृषि बीमा सुरक्षा",
        benefitHighlight: "मात्र ₹1 प्रीमियम में पूर्ण फसल बीमा सुरक्षा",
        summary:
          "सूखा, बेमौसम बारिश और कीटों से होने वाले फसल नुकसान से सुरक्षा। मालिक और बटाईदार (किरायेदार) दोनों किसान इसके पात्र हैं।",
        documents: ["आधार कार्ड", "7/12 उतारा या किरायेदारी प्रमाण", "ई-पीक पाहणी बुवाई प्रमाण", "बैंक पासबुक"]
      },
      marathi: {
        name: "प्रधानमंत्री पीक विमा योजना (₹१ मध्ये पीक विमा)",
        sectorLabel: "कृषी विमा संरक्षण",
        benefitHighlight: "फक्त ₹१ हप्त्यात संपूर्ण पीक विमा संरक्षण",
        summary:
          "दुष्काळ, अवकाळी पाऊस किंवा रोगराईमुळे होणाऱ्या पिकांच्या नुकसानीची भरपाई मिळते. जमीन मालक आणि कुळ/भाडेकरू शेतकरी दोघेही पात्र आहेत.",
        documents: ["आधार कार्ड", "७/१२ उतारा किंवा भाडेकरार", "ई-पीक पाहणी नोंद", "बँक पासबुक"]
      }
    }
  },
  {
    id: "majhi-ladki-bahin",
    code: "MH-CMLBY",
    name: "Mukhyamantri Majhi Ladki Bahin Yojana",
    sector: "Women & MSME",
    ministry: "Women & Child Development Dept, Maharashtra",
    jurisdiction: "Maharashtra State",
    category: "Social Welfare & Women",
    annual_benefit_inr: "₹18,000 / year (₹1,500 / month via DBT)",
    benefit_summary:
      "Transfers ₹1,500 every month (₹18,000 per year) directly to the Aadhaar-linked bank accounts of eligible women in Maharashtra aged 21–65 to strengthen financial independence and livelihood.",
    required_documents: [
      "Aadhaar Card",
      "Maharashtra Domicile / Ration Card",
      "Income Proof (< ₹2.5L)",
      "Bank Passbook"
    ],
    application_channel: "Ladki Bahin Official Portal",
    official_portal: "https://ladakibahin.maharashtra.gov.in",
    rules: {
      min_age: 21,
      max_age: 65,
      allowed_genders: ["female"],
      max_annual_income: 250000,
      allowed_states: ["Maharashtra"]
    },
    translations: {
      hindi: {
        name: "मुख्यमंत्री माझी लाडकी बहीण योजना",
        sectorLabel: "महिला सशक्तिकरण एवं उद्यमिता",
        benefitHighlight: "₹18,000 / वर्ष (₹1,500 / माह सीधे बैंक खाते में)",
        summary:
          "महाराष्ट्र की 21 से 65 वर्ष आयु की पात्र महिलाओं को आर्थिक स्वावलंबन और पोषण के लिए हर महीने ₹1,500 सीधे उनके आधार-लिंक्ड बैंक खाते में मिलते हैं।",
        documents: ["आधार कार्ड", "महाराष्ट्र अधिवास / राशन कार्ड", "आय प्रमाण पत्र (< ₹2.5L)", "बैंक पासबुक"]
      },
      marathi: {
        name: "मुख्यमंत्री माझी लाडकी बहीण योजना",
        sectorLabel: "महिला सक्षमीकरण व कल्याण",
        benefitHighlight: "₹१८,००० / वर्ष (₹१,५०० / महिना थेट बँक खात्यात)",
        summary:
          "महाराष्ट्रातील २१ ते ६५ वयोगटातील पात्र महिलांना आर्थिक स्वावलंबनासाठी दरमहा ₹१,५०० थेट आधार संलग्न बँक खात्यात जमा केले जातात.",
        documents: ["आधार कार्ड", "अधिवास प्रमाणपत्र / रेशन कार्ड", "उत्पन्नाचा दाखला (< ₹२.५ लाख)", "बँक पासबुक"]
      }
    }
  },
  {
    id: "pm-vishwakarma",
    code: "PM-VISHWAKARMA",
    name: "PM Vishwakarma Kaushal Samman (Tailoring & Artisan MSME)",
    sector: "Women & MSME",
    ministry: "Ministry of Micro, Small & Medium Enterprises",
    jurisdiction: "Central Government",
    category: "Skill & Livelihood",
    annual_benefit_inr: "₹15,000 Toolkit Grant + ₹3,00,000 Loan at 5%",
    benefit_summary:
      "Empowers tailors, self-employed women entrepreneurs, and traditional artisans with a ₹15,000 e-voucher for modern sewing/business equipment, ₹500/day training stipend, and collateral-free enterprise credit at 5% subsidized interest.",
    required_documents: [
      "Aadhaar Card",
      "Ration Card",
      "Bank Passbook",
      "Self-Employed / MSME Trade Declaration"
    ],
    application_channel: "PM Vishwakarma Portal",
    official_portal: "https://pmvishwakarma.gov.in",
    rules: {
      min_age: 18,
      max_age: 65,
      max_annual_income: 350000,
      allowed_states: ["all"],
      allowed_occupations: ["business_owner", "homemaker", "unemployed", "other"]
    },
    translations: {
      hindi: {
        name: "पीएम विश्वकर्मा कौशल सम्मान योजना (सिलाई एवं MSME उद्यमी)",
        sectorLabel: "महिला एवं सूक्ष्म उद्यम (MSME)",
        benefitHighlight: "₹15,000 टूलकिट अनुदान + 5% ब्याज पर ₹3 लाख बिना गारंटी ऋण",
        summary:
          "सिलाई (टेलरिंग), बुनाई और स्वरोजगार करने वाले उद्यमियों को आधुनिक मशीन खरीदने के लिए ₹15,000 का वाउचर और व्यवसाय बढ़ाने के लिए 5% रियायती ब्याज पर ₹3 लाख तक का ऋण मिलता है।",
        documents: ["आधार कार्ड", "राशन कार्ड", "बैंक पासबुक", "स्वरोजगार / व्यवसाय प्रमाण"]
      },
      marathi: {
        name: "पीएम विश्वकर्मा कौशल्य सन्मान योजना (शिलाई व MSME उद्योग)",
        sectorLabel: "महिला व सूक्ष्म उद्योग (MSME)",
        benefitHighlight: "₹१५,००० टूलकिट अनुदान + ५% व्याजाने ₹३ लाख विनातारण कर्ज",
        summary:
          "शिलाई काम (टेलरिंग) व स्वयंरोजगार करणाऱ्या व्यावसायिकांना आधुनिक साहित्यासाठी ₹१५,००० अनुदान आणि व्यवसाय वाढीसाठी ५% सवलतीच्या व्याजदराने ₹३ लाखांपर्यंत कर्ज मिळते.",
        documents: ["आधार कार्ड", "रेशन कार्ड", "बँक पासबुक", "स्वयंरोजगार / व्यवसाय प्रमाणपत्र"]
      }
    }
  },
  {
    id: "post-matric-scholarship",
    code: "NSP-MAHADBT",
    name: "Post-Matric Scholarship & Higher Education Tuition Freeship",
    sector: "Education",
    ministry: "Ministry of Social Justice & State Higher Education Dept",
    jurisdiction: "Central & State Portals",
    category: "Skill & Livelihood",
    annual_benefit_inr: "100% Tuition & Exam Fee Waiver + ₹13,500/yr Stipend",
    benefit_summary:
      "Reimburses 100% of approved college tuition fees, examination fees, and provides an annual academic maintenance and hostel allowance for college students from households earning up to ₹2.5 Lakhs.",
    required_documents: [
      "Aadhaar Card",
      "College Bonafide & Fee Receipt",
      "Tehsildar Income Certificate (< ₹2.5L)",
      "Previous Year Marksheet",
      "Student Bank Passbook"
    ],
    application_channel: "National Scholarship / MahaDBT Portal",
    official_portal: "https://scholarships.gov.in",
    rules: {
      min_age: 15,
      max_age: 32,
      max_annual_income: 250000,
      allowed_states: ["all"],
      allowed_occupations: ["student"]
    },
    translations: {
      hindi: {
        name: "पोस्ट-मैट्रिक छात्रवृत्ति एवं उच्च शिक्षा शिक्षण शुल्क माफी",
        sectorLabel: "उच्च शिक्षा एवं छात्रवृत्ति",
        benefitHighlight: "100% कॉलेज ट्यूशन फीस माफी + ₹13,500/वर्ष भत्ता",
        summary:
          "₹2.5 लाख से कम पारिवारिक आय वाले कॉलेज छात्रों की 100% ट्यूशन और परीक्षा फीस की प्रतिपूर्ति की जाती है तथा हॉस्टल व किताबों के लिए वार्षिक भत्ता मिलता है।",
        documents: ["आधार कार्ड", "कॉलेज बोनाफाइड व फीस रसीद", "आय प्रमाण पत्र (< ₹2.5L)", "अंकसूची", "बैंक पासबुक"]
      },
      marathi: {
        name: "पोस्ट-मॅट्रिक शिष्यवृत्ती व उच्च शिक्षण शुल्क प्रतिपूर्ती (Freeship)",
        sectorLabel: "उच्च शिक्षण व शिष्यवृत्ती",
        benefitHighlight: "१००% कॉलेज शिक्षण व परीक्षा शुल्क माफी + ₹१३,५००/वर्ष निर्वाह भत्ता",
        summary:
          "₹२.५० लाखांपेक्षा कमी कौटुंबिक उत्पन्न असलेल्या महाविद्यालयीन विद्यार्थ्यांची १००% ट्युशन व परीक्षा फी परत मिळते आणि वसतिगृह/निर्वाह भत्ता दिला जातो.",
        documents: ["आधार कार्ड", "कॉलेज बोनाफाईड व फी पावती", "उत्पन्नाचा दाखला (< ₹२.५ लाख)", "गुणपत्रिका", "बँक पासबुक"]
      }
    }
  },
  {
    id: "ayushman-vay-vandana",
    code: "PMJAY-70PLUS",
    name: "Ayushman Vay Vandana Card (Senior Citizen 70+ Universal Health Cover)",
    sector: "Healthcare",
    ministry: "National Health Authority (Ministry of Health)",
    jurisdiction: "Central Government",
    category: "Healthcare & Senior Care",
    annual_benefit_inr: "₹5,00,000 / year Free Senior Hospitalization Cover",
    benefit_summary:
      "Guaranteed ₹5 Lakh annual cashless hospitalization cover across 29,000+ empanelled private and government hospitals for all senior citizens aged 70 years and above, with zero waiting period for pre-existing conditions.",
    required_documents: [
      "Aadhaar Card (Showing Age 70+)",
      "Aadhaar-linked Mobile Number for e-KYC"
    ],
    application_channel: "NHA Ayushman Beneficiary Portal",
    official_portal: "https://beneficiary.nha.gov.in",
    rules: {
      min_age: 70,
      allowed_states: ["all"]
    },
    translations: {
      hindi: {
        name: "आयुष्मान वय वंदना कार्ड (70+ वरिष्ठ नागरिक स्वास्थ्य सुरक्षा)",
        sectorLabel: "स्वास्थ्य एवं वरिष्ठ नागरिक सेवा",
        benefitHighlight: "₹5,00,000 / वर्ष निःशुल्क कैशलेस अस्पताल उपचार",
        summary:
          "70 वर्ष और उससे अधिक आयु के सभी वरिष्ठ नागरिकों को देश भर के 29,000+ सूचीबद्ध सरकारी और निजी अस्पतालों में ₹5 लाख तक का निःशुल्क कैशलेस इलाज मिलता है।",
        documents: ["आधार कार्ड (आयु 70+ प्रमाण)", "आधार से जुड़ा मोबाइल नंबर"]
      },
      marathi: {
        name: "आयुष्मान वय वंदना कार्ड (७०+ ज्येष्ठ नागरिक मोफत आरोग्य कवच)",
        sectorLabel: "आरोग्य व ज्येष्ठ नागरिक सेवा",
        benefitHighlight: "₹५,००,००० / वर्ष मोफत कॅशलेस रुग्णालय उपचार",
        summary:
          "७० वर्षे किंवा त्याहून अधिक वयाच्या सर्व ज्येष्ठ नागरिकांना देशभरातील नोंदणीकृत खाजगी व सरकारी रुग्णालयांमध्ये ₹५ लाखांपर्यंत मोफत कॅशलेस उपचार मिळतात.",
        documents: ["आधार कार्ड (वय ७०+ पुरावा)", "आधार संलग्न मोबाईल क्रमांक"]
      }
    }
  },
  {
    id: "shravanbal-senior-pension",
    code: "MH-SSRY",
    name: "Shravanbal Seva Rajya Nivruttivetan & Indira Gandhi Old Age Pension",
    sector: "Healthcare",
    ministry: "Social Justice & Special Assistance Dept",
    jurisdiction: "Central & State Senior Pension",
    category: "Healthcare & Senior Care",
    annual_benefit_inr: "₹18,000 / year (₹1,500 / month Senior Pension)",
    benefit_summary:
      "Provides a assured monthly old-age pension of ₹1,500 (₹18,000/year) via Direct Benefit Transfer to senior citizens aged 65+ from low-income households to cover medicines and daily living needs.",
    required_documents: [
      "Aadhaar Card",
      "Age Proof (65+ Years)",
      "Income Certificate / Ration Card",
      "Bank Passbook"
    ],
    application_channel: "Aaple Sarkar / Tehsil Office Portal",
    official_portal: "https://aaplesarkar.mahaonline.gov.in",
    rules: {
      min_age: 65,
      max_annual_income: 250000,
      allowed_states: ["all"]
    },
    translations: {
      hindi: {
        name: "श्रवणबाळ सेवा राज्य निवृत्तिवेतन एवं वृद्धावस्था पेंशन योजना",
        sectorLabel: "वरिष्ठ नागरिक पेंशन एवं स्वास्थ्य",
        benefitHighlight: "₹18,000 / वर्ष (₹1,500 / माह वरिष्ठ नागरिक पेंशन)",
        summary:
          "65 वर्ष से अधिक आयु के वरिष्ठ नागरिकों को दवाइयों और दैनिक जीवन की जरूरतों के लिए हर महीने ₹1,500 की पेंशन सीधे बैंक खाते में दी जाती है।",
        documents: ["आधार कार्ड", "आयु प्रमाण पत्र (65+ वर्ष)", "आय प्रमाण / राशन कार्ड", "बैंक पासबुक"]
      },
      marathi: {
        name: "श्रावणबाळ सेवा राज्य निवृत्तीवेतन योजना (ज्येष्ठ नागरिक पेन्शन)",
        sectorLabel: "ज्येष्ठ नागरिक पेन्शन व आरोग्य",
        benefitHighlight: "₹१८,००० / वर्ष (₹१,५०० / महिना ज्येष्ठ नागरिक पेन्शन)",
        summary:
          "६५ वर्षांवरील पात्र ज्येष्ठ नागरिकांना औषधोपचार व दैनंदिन गरजांसाठी दरमहा ₹१,५०० निवृत्तीवेतन थेट बँक खात्यात दिले जाते.",
        documents: ["आधार कार्ड", "वयाचा दाखला (६५+ वर्षे)", "उत्पन्नाचा दाखला / रेशन कार्ड", "बँक पासबुक"]
      }
    }
  },
  {
    id: "ayushman-bharat",
    code: "AB-PMJAY",
    name: "Ayushman Bharat PM-JAY & Mahatma Phule Jan Arogya Yojana",
    sector: "Healthcare",
    ministry: "National Health Authority & State Public Health Dept",
    jurisdiction: "Central & State Combined Health Cover",
    category: "Healthcare & Senior Care",
    annual_benefit_inr: "₹5,00,000 / family / year Cashless Health Cover",
    benefit_summary:
      "Covers up to ₹5 Lakh per family per year for 1,350+ surgical and medical treatments across government and empanelled private hospitals with zero out-of-pocket expenses.",
    required_documents: [
      "Aadhaar Card",
      "Ration Card (Yellow / Orange)",
      "Income Certificate (< ₹2.5L)"
    ],
    application_channel: "Ayushman Bharat Official Portal",
    official_portal: "https://beneficiary.nha.gov.in",
    rules: {
      max_annual_income: 250000,
      allowed_states: ["all"]
    },
    translations: {
      hindi: {
        name: "आयुष्मान भारत PM-JAY एवं महात्मा फुले जन आरोग्य योजना",
        sectorLabel: "स्वास्थ्य सुरक्षा",
        benefitHighlight: "₹5,00,000 / परिवार / वर्ष कैशलेस स्वास्थ्य बीमा",
        summary:
          "पात्र परिवारों को सरकारी और सूचीबद्ध निजी अस्पतालों में 1,350 से अधिक गंभीर बीमारियों और सर्जरी के लिए प्रति वर्ष ₹5 लाख तक का मुफ्त इलाज मिलता है।",
        documents: ["आधार कार्ड", "राशन कार्ड (पीला / केसरिया)", "आय प्रमाण पत्र (< ₹2.5L)"]
      },
      marathi: {
        name: "आयुष्मान भारत व महात्मा ज्योतिराव फुले जन आरोग्य योजना",
        sectorLabel: "आरोग्य सुरक्षा",
        benefitHighlight: "₹५,००,००० / कुटुंब / वर्ष मोफत वैद्यकीय उपचार",
        summary:
          "पात्र कुटुंबांना शासकीय व नोंदणीकृत खाजगी रुग्णालयांमध्ये १,३५० पेक्षा जास्त शस्त्रक्रिया व उपचारांसाठी प्रति वर्ष ₹५ लाखांपर्यंत कॅशलेस आरोग्य कवच मिळते.",
        documents: ["आधार कार्ड", "रेशन कार्ड (पिवळे / केशरी)", "उत्पन्नाचा दाखला (< ₹२.५ लाख)"]
      }
    }
  }
];
