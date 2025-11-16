import React from 'react'
import { useCity } from '../context/CityContext'
import CustomDropdown from './CustomDropdown'

const CITIES = [
    { value: 'Ангарск', label: 'Ангарск' },
    { value: 'Байкальск', label: 'Байкальск' },
    { value: 'Балаково', label: 'Балаково' },
    { value: 'Билибино', label: 'Билибино' },
    { value: 'Волгодонск', label: 'Волгодонск' },
    { value: 'Глазов', label: 'Глазов' },
    { value: 'Десногорск', label: 'Десногорск' },
    { value: 'Димитровград', label: 'Димитровград' },
    { value: 'Железногорск', label: 'Железногорск' },
    { value: 'ЗАТО Заречный', label: 'ЗАТО Заречный' },
    { value: 'Заречный', label: 'Заречный' },
    { value: 'Зеленогорск', label: 'Зеленогорск' },
    { value: 'Краснокаменск', label: 'Краснокаменск' },
    { value: 'Курчатов', label: 'Курчатов' },
    { value: 'Лесной', label: 'Лесной' },
    { value: 'Неман', label: 'Неман' },
    { value: 'Нововоронеж', label: 'Нововоронеж' },
    { value: 'Новоуральск', label: 'Новоуральск' },
    { value: 'Обнинск', label: 'Обнинск' },
    { value: 'Озерск', label: 'Озерск' },
    { value: 'Певек', label: 'Певек' },
    { value: 'Полярные Зори', label: 'Полярные Зори' },
    { value: 'Саров', label: 'Саров' },
    { value: 'Северск', label: 'Северск' },
    { value: 'Снежинск', label: 'Снежинск' },
    { value: 'Советск', label: 'Советск' },
    { value: 'Сосновый Бор', label: 'Сосновый Бор' },
    { value: 'Трехгорный', label: 'Трехгорный' },
    { value: 'Удомля', label: 'Удомля' },
    { value: 'Усолье-Сибирское', label: 'Усолье-Сибирское' },
    { value: 'Электросталь', label: 'Электросталь' },
    { value: 'Энергодар', label: 'Энергодар' }
]

export default function CitySelector(){
    const { city, setCity } = useCity()
    return (
        <CustomDropdown
            options={CITIES}
            value={city}
            onChange={setCity}
            placeholder="Выберите город"
        />
    )
}
