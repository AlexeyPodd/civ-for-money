import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import { selectIsArbiter } from "../../redux/authSlice";

export default function NavbarContainer() {
  const userIsArbiter = useSelector(selectIsArbiter);

  return <Navbar userIsArbiter={userIsArbiter} />
}
