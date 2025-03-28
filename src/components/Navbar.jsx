import { Link } from "react-router-dom";
import Txt  from "../baseComponents/Txt"

export default function Navbar(){
  return (
    <nav>
        <Txt> <Link to="/">         Home      </Link> </Txt>
        <Txt> <Link to="/register"> Singn Up  </Link> </Txt>
        <Txt> <Link to="/login">    Sign In   </Link> </Txt>
    </nav>
  );
};

