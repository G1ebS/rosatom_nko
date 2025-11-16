export const events = [
    {
        id: 1,
        title: "Благотворительный концерт",
        date: "2025-12-05",
        description: "Сбор средств для поддержки семей",
        city: "Ангарск",
        created_by: 1,
        category: "Мероприятия",
        online: false,
        time: "18:00"
    },
    {
        id: 2,
        title: "Субботник в парке",
        date: "2025-11-23",
        description: "Сбор и вывоз мусора, посадка деревьев.",
        city: "Ангарск",
        created_by: 2,
        category: "Мероприятия",
        online: false,
        time: "10:00"
    },
    {
        id: 3,
        title: "Мастер-класс по керамике",
        date: "2025-11-30",
        description: "Обучение работе с глиной и выставка работ.",
        city: "Нововоронеж",
        created_by: 2,
        category: "Обучение",
        online: false,
        time: "14:00"
    },
    {
        id: 4,
        title: "Тренировка в бассейне",
        date: "2025-11-18",
        description: "Регулярная тренировка в бассейне Арбат",
        city: "Ангарск",
        created_by: 1,
        category: "Спортивные сообщества",
        subcategory: "Тренировки в бассейне",
        online: false,
        time: "18:15"
    },
    {
        id: 5,
        title: "Беговой клуб",
        date: "2025-11-20",
        description: "Вебинар по запуску бегового сезона",
        city: "Все",
        created_by: 1,
        category: "Спортивные сообщества",
        subcategory: "Беговой клуб",
        online: true,
        time: "17:00"
    },
    {
        id: 6,
        title: "Гвоздестояние",
        date: "2025-11-19",
        description: "Офис, Conference Hall",
        city: "Ангарск",
        created_by: 1,
        category: "Спортивные сообщества",
        subcategory: "Гвоздестояние",
        online: false,
        time: "18:30"
    },
    {
        id: 7,
        title: "Завтрак с СЕО",
        date: "2025-11-25",
        description: "Начнём утро со смыслом. Приглашаем тех, кто недавно в команде.",
        city: "Ангарск",
        created_by: 1,
        category: "Мероприятия",
        subcategory: "Завтрак с СЕО",
        online: false,
        time: "10:30"
    },
    {
        id: 8,
        title: "Конференция лидеров",
        date: "2025-11-22",
        description: "Мероприятие посвящено обсуждению стратегий развития",
        city: "Все",
        created_by: 1,
        category: "Бизнес повестка",
        subcategory: "Конференции",
        online: true,
        time: "10:30"
    },
    {
        id: 9,
        title: "Книжный клуб",
        date: "2025-11-21",
        description: "Обсуждение книги месяца",
        city: "Ангарск",
        created_by: 2,
        category: "Развитие",
        subcategory: "Книжные клубы",
        online: false,
        time: "16:00"
    },
    {
        id: 10,
        title: "Комитет добрых дел",
        date: "2025-11-24",
        description: "Планирование благотворительных акций",
        city: "Ангарск",
        created_by: 1,
        category: "Комитет добрых дел",
        online: false,
        time: "15:00"
    }
]

// Цветовая схема для типов событий
export const eventCategoryColors = {
    "Мероприятия": {
        bg: "#FF6B6B",
        border: "#EE5A5A",
        text: "#FFFFFF"
    },
    "Обучение": {
        bg: "#4ECDC4",
        border: "#45B8B0",
        text: "#FFFFFF"
    },
    "Развитие": {
        bg: "#95E1D3",
        border: "#85D1C3",
        text: "#2C3E50"
    },
    "Бизнес повестка": {
        bg: "#F38181",
        border: "#E37171",
        text: "#FFFFFF"
    },
    "Спортивные сообщества": {
        bg: "#AA96DA",
        border: "#9A86CA",
        text: "#FFFFFF"
    },
    "Комитет добрых дел": {
        bg: "#FCBAD3",
        border: "#EC9AB3",
        text: "#2C3E50"
    },
    "Поздравления, награждения": {
        bg: "#FFD93D",
        border: "#EFC92D",
        text: "#2C3E50"
    },
    "Завтрак с СЕО": {
        bg: "#6BCB77",
        border: "#5BBB67",
        text: "#FFFFFF"
    }
}
