import Heading from "../components/Heading";
import Sidebar from "../components/Sidebar";
import SubHeading from "../components/SubHeading";
export default function Dashboard(){
    return(
        <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex p-5 items-center flex-col">
        <SubHeading label="Sales Overview"/>
        <div className="flex flex-row">
            <div className="px-5">Sales</div>
            <div className="px-5">Revenue</div>
            <div className="px-5">Profit</div>
            <div className="px-5">Cost</div>
            
        </div>
        <SubHeading label="Purchase Overview"/>
        <div className="flex flex-row">
            <div className="px-5">Sales</div>
            <div className="px-5">Revenue</div>
            <div className="px-5">Profit</div>
            <div className="px-5">Cost</div>
            
        </div>
        <SubHeading label="Sales & Purchase"/>
        <SubHeading label="Top Selling Stock"/>
        </div>
        </div>
    )

}