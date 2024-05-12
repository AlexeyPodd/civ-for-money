import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import { selectIsStaff } from "../../redux/authSlice";

export default function NavbarContainer() {
  const userIsStuff = useSelector(selectIsStaff);

  return <Navbar userIsStuff={userIsStuff} />
}
