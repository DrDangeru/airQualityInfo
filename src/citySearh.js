import React, { useState } from "react";

const CitySearch = ({ GetAirQuality }) => {
    const [inputValue, setInputValue] = useState('');

    function handleInputChange(event) {
        setInputValue(event.target.value);
    }

    function handleSearch(event) {
        event.preventDefault();
        const formattedCity = inputValue.replace(/ /g, '-');
        GetAirQuality(formattedCity)
    }


    return (
        <div >
            <form className=" flex items-center justify-center justify-content-center pl-24 pr-2 pt-2 pb-6 gap-16 text-center  " onSubmit={handleSearch} >
                <input className="rounded-md text-2xl border-4 p-4  ring-2 ring-orange-400 ring-offset-2 ring-offset-purple-100/[.35]"

                    type="text" placeholder="Enter City"
                    onChange={handleInputChange}></input>
                <button className="text-2xl px-12 py-4 rounded-md bg-blue-400 text-white  transition ease-in-out delay-50 bg-blue-500 hover:-translate-y-1 hover:scale-107 hover:bg-blue-600 duration-300 " type="submit">
                    Search
                </button>
            </form>
        </div>
    )
}

export default CitySearch