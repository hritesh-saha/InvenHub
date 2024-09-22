export default function Button({label,onClick}){
    return(
    <button type="button" onClick={onClick} className="text-orange-400 w-50 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 my-5" >{label}</button>
    )
}