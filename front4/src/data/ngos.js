export const ngos = [
    {
        id: 1,
        name: "Центр помощи детям",
        city: "Ангарск",
        category: "Соцподдержка",
        short_description: "Помогаем детям и семьям в трудной жизненной ситуации.",
        full_description: "Центр оказывает консультационную и материальную помощь детям и их семьям. Мы организуем мероприятия и привлекаем волонтёров.",
        address: "ул. Ленина, 10",
        logo: "",
        website: "https://example.org",
        vk: "https://vk.com/example",
        telegram: "https://t.me/example",
        status: "approved", // pending, approved, rejected
        created_by: 1
    },
    {
        id: 2,
        name: "Эко-друзья",
        city: "Ангарск",
        category: "Экология",
        short_description: "Субботники, сборы вторсырья и просветительские акции.",
        full_description: "Организация проводит очистки природных территорий и образовательные мероприятия по переработке отходов.",
        address: "пр. Победы, 5",
        logo: "",
        website: "https://eco-friends.org",
        vk: "https://vk.com/ecofriends",
        telegram: null,
        status: "approved",
        created_by: 1
    },
    {
        id: 3,
        name: "Творческая мастерская",
        city: "Нововоронеж",
        category: "Культура",
        short_description: "Мастер-классы для детей и взрослых.",
        full_description: "Развиваем креативность и поддерживаем местных художников.",
        address: "ул. Мира, 2",
        logo: "",
        website: "https://creative-workshop.ru",
        vk: null,
        telegram: "https://t.me/creative_workshop",
        status: "approved",
        created_by: 2
    },
    {
        id: 4,
        name: "Новое НКО на модерации",
        city: "Ангарск",
        category: "Экология",
        short_description: "Ожидает проверки администратором.",
        full_description: "Это НКО находится на модерации и будет опубликовано после проверки.",
        address: "ул. Тестовая, 1",
        logo: "",
        website: "",
        vk: null,
        telegram: null,
        status: "pending",
        created_by: 3
    }
]
