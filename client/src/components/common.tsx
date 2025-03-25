import { createContext } from "react";

export type DataContextType = {
  data: RealtyObject[] | null;
  setData: (data: RealtyObject[] | null) => void;
};
export const DataContext = createContext<DataContextType | null>(null);

export type MobileContextType = {
  mobile: boolean;
  setMobile: (mobile: boolean) => void;
};
export const MobileContext = createContext<MobileContextType | null>(null);

export function correspondence(realtyType: string | undefined): string {
  let typeToShow: string;
  switch (realtyType) {
    case "flat":
      typeToShow = "квартира";
      break;
    case "townhouse":
      typeToShow = "таунхаус";
      break;
    case "room":
      typeToShow = "комната";
      break;
    case "cottage":
      typeToShow = "дом";
      break;
    case "dacha":
      typeToShow = "дача";
      break;
    case "land":
      typeToShow = "участок";
      break;
    case "garage":
      typeToShow = "гараж";
      break;
    case "commercial":
      typeToShow = "коммерческая";
      break;
    default:
      typeToShow = "квартира";
  }
  return typeToShow;
}

export function detectBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.indexOf("firefox") > -1) {
    return "Firefox";
  } else if (userAgent.indexOf("chrome") > -1) {
    return "Chrome";
  } else if (userAgent.indexOf("safari") > -1) {
    return "Safari";
  } else if (userAgent.indexOf("opera") > -1 || userAgent.indexOf("opr") > -1) {
    return "Opera";
  } else if (
    userAgent.indexOf("msie") > -1 ||
    userAgent.indexOf("trident") > -1
  ) {
    return "Internet Explorer";
  } else {
    return "Unknown";
  }
}

export type RealtyType =
  | "choice"
  | "flat"
  | "room"
  | "land"
  | "garage"
  | "cottage"
  | "dacha"
  | "townhouse"
  | "commercial";

export type RealtyObject = {
  id?: string;
  type?: string; // forSale or forRent
  infoType: RealtyType; //type of a realty object
  //markerSign?: string; // one letter displayed on the pin (marker). "1" means 1-bedroom flat, "Д" - a cottage, and so on
  shortDescription?: string; // text under a card in the left menu, and also within popup, which is tied with a pin
  //infoName?: string; // header for realty object page
  infoPrice?: string;
  infoAddress?: string;
  position: [number, number]; // LatLngExpression;
  //latitude?: number;
  //longitude?: number;
  infoArea?: string;
  infoDescription?: string; // (detailed) description of a realty object on it's page
  infoDetails?: {
    // for now the info is related to the flat type objects only
    totalArea: string;
    numberOfRooms?: number;
    residentialArea?: string; // жилая площадь
    kitchenArea?: string;
    landArea?: string; // участок для таунхауса или дома
    floor?: number;
    totalFloors?: number;
  };
  images?: string[];
};

export const raw: RealtyObject[] = [
  {
    id: "67d13e3b5ba37da75e5e948c",
    type: "forSale",
    infoType: "townhouse",
    shortDescription: "Дом 446 м² на участке 2 сот.",
    infoPrice: "36000000",
    infoAddress: "Московская обл, г. Дубна, ул. Мичурина, 33/25",
    position: [56.7551981, 37.19862525230932],
    infoArea: "",
    infoDescription:
      "Прoдaeтся дом-таунхаус в комплекcе «Изумpудный город»! 🌟\r\n" +
      "\r\n" +
      "Ищeте идeaльнoe coчeтaниe городскoй жизни и уютa индивидуальногo домa? Этoт таунхаус площaдью 446 кв.м. — именно тo, что вaм нужнo!\r\n" +
      "\r\n" +
      "🏡 Планирoвка:\r\n" +
      "\r\n" +
      "• 1 этаж (128 кв.м): Пpоcторнaя гоcтиная и кухня с выcотой потoлкoв 4 м, место для кaмина (дымохoд cмoнтиpовaн)\r\n" +
      "\r\n" +
      "• 2 этaж (134,4 кв.м): Mеcто для 4-x cпaлен; 2 санузлов. Высота потолков около 3 м.\r\n" +
      "\r\n" +
      "2 лоджии и балкон\r\n" +
      "\r\n" +
      "• 3 этаж (34,1 кв.м): Отличное пространство под кабинет или оранжерею с выходом на крышу.\r\n" +
      "\r\n" +
      "• Цокольный этаж (132 кв.м): С окнами и отдельным входом, идеально подходит для тренажерного зала, сауны или постирочной. Высота 3 м\r\n" +
      "\r\n" +
      "🔨 Конструктив:\r\n" +
      "\r\n" +
      "• Толстые кирпичные стены с утеплением — дом теплый и комфортный\r\n" +
      "\r\n" +
      "• Монолитные межэтажные перекрытия\r\n" +
      "\r\n" +
      "• Панорамные окна из алюминия производства Германии, наполняющие пространство светом\r\n" +
      "\r\n" +
      "🌳 Коммуникации и внутренняя инфраструктура:\r\n" +
      "\r\n" +
      "· Городские коммуникации (водоснабжение, канализация, отопление)\r\n" +
      "\r\n" +
      "· Собственная служба эксплуатации\r\n" +
      "\r\n" +
      "· Комплекс «Изумрудный город» — это 16 домовладений с огороженной территорией и въездом через шлагбаум. Безопасность и комфорт в сочетании с природой в черте города!\r\n" +
      "\r\n" +
      "🏞️ Инфраструктура:\r\n" +
      "\r\n" +
      "• Прямо за пределами комплекса расположен Парк-Набережная имени Д.И. Менделеева площадью 24 га с променадом, велодорожками, катком, бассейном, яхт-клубом и скейт-площадками.\r\n" +
      "\r\n" +
      "• В шаговой доступности детские сады, школы, магазины и спортивные центры.\r\n" +
      "\r\n" +
      "📞 Не упустите свой шанс! Один собственник, документы готовы. Звоните прямо сейчас и узнайте больше об этом уникальном предложении!",
    infoDetails: {
      totalArea: "446",
      numberOfRooms: "",
      residentialArea: "",
      kitchenArea: "",
      floor: null,
      totalFloors: "3",
    },
    images: [
      "real/izum2/f1.jpeg",
      "real/izum2/f2.jpeg",
      "real/izum2/f3.jpeg",
      "real/izum2/f4.jpeg",
      "real/izum2/f5.jpeg",
      "real/izum2/f6.jpeg",
      "real/izum2/f7.jpeg",
      "real/izum2/f8.jpeg",
      "real/izum2/f8.jpeg",
      "real/izum2/f9.jpeg",
      "real/izum2/f10.jpeg",
      "real/izum2/f11.jpeg",
      "real/izum2/f12.jpeg",
      "real/izum2/f13.jpeg",
      "real/izum2/f14.jpeg",
    ],
  },

  {
    id: "67d141b95ba37da75e5e948d",
    type: "forSale",
    infoType: "flat",
    shortDescription: "2-к. квартира, 42,5 м², 4/4 эт.",
    infoPrice: "6300000",
    infoAddress: "Московская обл, г. Дубна, ул. Векслера, 20",
    position: [56.75343855, 37.19690391702959],
    infoArea: null,
    infoDescription:
      "🌿 Пpодaется уютнaя кваpтира в зеленoм рaйоне Дубны! 🌿\r\n" +
      "\r\n" +
      "Ищете идеальноe мecтo для жизни? У нac eсть предложeниe для вас!\r\n" +
      "\r\n" +
      "🏡 Xаpaктеристики квартиpы:\r\n" +
      "\r\n" +
      "• Две изолиpованныe комнаты (узаконeнная перeплaнировкa)\r\n" +
      "\r\n" +
      "• Свeтлыe окнa, выходящиe вo двор на югo-востoк\r\n" +
      "\r\n" +
      "• Тeплая и кoмфopтнaя aтмocфеpa\r\n" +
      "\r\n" +
      "🔑 Дополнительные преимущества:\r\n" +
      "\r\n" +
      "• Сарай в подвальном этаже\r\n" +
      "\r\n" +
      "• Спокойные и доброжелательные соседи\r\n" +
      "\r\n" +
      "• Чистый подъезд\r\n" +
      "\r\n" +
      "🌳 Инфраструктура:\r\n" +
      "\r\n" +
      "• Просторный двор с множеством парковочных мест и детской площадкой\r\n" +
      "\r\n" +
      "• Школа – через дорогу с пешеходным переходом\r\n" +
      "\r\n" +
      "• Рядом детские сады и хоровая школа\r\n" +
      "\r\n" +
      "🏞️ Активный отдых:\r\n" +
      "\r\n" +
      "• Всего 50 м до парка с большой детской зоной, дорожками для велосипедов и скейтов, яхт-клубом и благоустроенной набережной длиной 3 км с городским пляжем!\r\n" +
      "\r\n" +
      "🛍️ Удобства в шаговой доступности:\r\n" +
      "\r\n" +
      "• Магазины, фитнес-клуб, поликлиника, ж/д вокзал\r\n" +
      "\r\n" +
      "👥 Собственность:\r\n" +
      "\r\n" +
      "• Два взрослых собственника, альтернатива. Оперативные показы!\r\n" +
      "\r\n" +
      "Не упустите шанс стать владельцем этой квартиры! Звоните прямо сейчас для записи на просмотр! 📞",
    infoDetails: {
      totalArea: "42.5",
      numberOfRooms: "2",
      residentialArea: "23",
      kitchenArea: "5.8",
      landArea: null,
      floor: "4",
      totalFloors: "4",
    },
    images: [
      "real/Veksler2/pic1.jpeg",
      "real/Veksler2/pic2.jpeg",
      "real/Veksler2/pic3.jpeg",
      "real/Veksler2/pic4.jpeg",
      "real/Veksler2/pic5.jpeg",
      "real/Veksler2/pic6.jpeg",
      "real/Veksler2/pic7.jpeg",
      "real/Veksler2/pic8.jpeg",
      "real/Veksler2/pic9.jpeg",
      "real/Veksler2/pic10.jpeg",
      "real/Veksler2/pic11.jpeg",
      "real/Veksler2/pic12.jpeg",
      "real/Veksler2/pic13.jpeg",
      "real/Veksler2/pic14.jpeg",
      "real/Veksler2/pic15.jpeg",
      "real/Veksler2/pic16.jpeg",
    ],
  },
  {
    id: "67d144365ba37da75e5e948e",
    type: "forSale",
    infoType: "flat",
    shortDescription: "4-к. квартира, 95 м², 3/3 эт",
    infoPrice: "19000000",
    infoAddress: "Московская обл, г. Дубна, ул. Ленинградская, 26",
    position: [56.748360399999996, 37.204355275024746],
    infoArea: null,
    infoDescription:
      "🌟 Прoдaется уникальнaя 4-комнатная квартиpа в инcтитутскoй чaсти гoрода 🌟\r\n" +
      "Идеaльный выбop для бoльшoй семьи: 4 изолирoвaнные комнaты, рaздeльный санузел и два балкoна сoздадут комфoртное прoстранcтвo для Вашeй жизни.\r\n" +
      "✨ Оcoбеннoсти:\r\n" +
      "• Прocторная плaнирoвка, экологичнaя отдeлка\r\n" +
      "• Bысокие пoтолки, oкнa-двери на балконы создают хороший объем квартиры\r\n" +
      "• Малонаселенный подъезд, всего 6 квартир – по две квартиры на этаже\r\n" +
      "🏞️ Отличное месторасположение: рядом лесопарковая зона, набережная Волги, школы, детские сады, поликлиника, супермаркеты и ж/д вокзал.\r\n" +
      "\r\n" +
      "Не упустите шанс стать обладателем этого уютного и просторного жилья! Звоните сейчас! 📞",
    infoDetails: {
      totalArea: "95",
      numberOfRooms: "4",
      residentialArea: "61.2",
      kitchenArea: "8.5",
      landArea: null,
      floor: "3",
      totalFloors: "3",
    },
    images: [
      "real/Lenin2/image1.jpeg",
      "real/Lenin2/image2.jpeg",
      "real/Lenin2/image3.jpeg",
      "real/Lenin2/image4.jpeg",
      "real/Lenin2/image5.jpeg",
      "real/Lenin2/image6.jpeg",
      "real/Lenin2/image7.jpeg",
      "real/Lenin2/image8.jpeg",
      "real/Lenin2/image9.jpeg",
      "real/Lenin2/image10.jpeg",
      "real/Lenin2/image11.jpeg",
      "real/Lenin2/image12.jpeg",
      "real/Lenin2/image13.jpeg",
      "real/Lenin2/image14.jpeg",
      "real/Lenin2/image15.jpeg",
    ],
  },
  {
    id: "67d144365ba37da75e5e948e-me",
    type: "forSale",
    infoType: "land",
    shortDescription: "Участок Тверская обл. около деревни Губин угол",
    infoPrice: "1000000",
    infoAddress: "Тверская обл., около деревни Губин угол",
    position: [56.820804054459444, 37.216445953081035],
    infoArea: null,
    infoDescription:
      "очень длинный текст очень длинный текст очень длинный текст очень длинный текст очень длинный текст очень длинный текст очень длинный текст",
    infoDetails: {
      totalArea: "95",
      numberOfRooms: "4",
      residentialArea: "61.2",
      kitchenArea: "8.5",
      landArea: null,
      floor: "3",
      totalFloors: "3",
    },
    images: ["real/land1.jpeg"],
  },
  {
    id: "67d144365ba37da75e5e948e-me2",
    type: "forSale",
    infoType: "land",
    shortDescription: "участок Тверская обл. около деревни Крева",
    infoPrice: "1000000",
    infoAddress: "Тверская обл., около деревни Крева",
    position: [56.7925746932406, 37.217948619703],
    infoArea: null,
    infoDescription:
      "очень длинный текст очень длинный текст очень длинный текст очень длинный текст очень длинный текст очень длинный текст очень длинный текст",
    infoDetails: {
      totalArea: "95",
      numberOfRooms: "4",
      residentialArea: "61.2",
      kitchenArea: "8.5",
      landArea: null,
      floor: "3",
      totalFloors: "3",
    },
    images: ["real/land2.jpeg"],
  },

  {
    id: "67d144365ba37da75e5e948e-me3",
    type: "forSale",
    infoType: "land",
    shortDescription: "Участок на берегу Волги около деревни Пекуново",
    infoPrice: "1000000",
    infoAddress: "Тверская обл., берег Волги, около деревни Пекуново",
    position: [56.79007522576646, 37.24521923607614],
    infoArea: null,
    infoDescription:
      "очень длинный текст очень длинный текст очень длинный текст очень длинный текст очень длинный текст очень длинный текст очень длинный текст",
    infoDetails: {
      totalArea: "95",
      numberOfRooms: "4",
      residentialArea: "61.2",
      kitchenArea: "8.5",
      landArea: null,
      floor: "3",
      totalFloors: "3",
    },
    images: ["real/land3.jpeg"],
  },
];
