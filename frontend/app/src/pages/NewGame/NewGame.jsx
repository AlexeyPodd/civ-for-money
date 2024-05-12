import LoginOffer from "../../components/LoginOffer/LoginOffer"

export default function NewGame({isAuth}) {
  if (!isAuth) return <LoginOffer />
  return (
    <div>NewGame</div>
  )
}
