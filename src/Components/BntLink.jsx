import { Link } from "react-router-dom";

export default function BntLink({to, textBnt, classNameBnt="", classNameLink=""}){
    <Link to={to} className={classNameLink}><button className={classNameBnt}>{textBnt}</button></Link>
}