import {Link} from 'react-router-dom';
export default function BottomText({label,text,to}){
    return(
        <div className='py-2 text-sm flex justify-center'>
            <div>
                {label}
            </div>
        <Link to={to}>{text}</Link>
        </div>
    )
}