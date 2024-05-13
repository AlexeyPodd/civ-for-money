import { useContext } from "react";
import { SignerContext } from "../../context/SignerContext";

export default function Game() {
  const { signer } = useContext(SignerContext);
  return <>
    <div>Game</div>
    {signer && <div>{signer.address}</div>}
  </>
}
