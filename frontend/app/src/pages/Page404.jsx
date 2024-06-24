import SomeError from "../components/SomeError/SomeError";

export default function Page404() {
  return (
    <SomeError error={{status: 404, data: {detail: "Page not found"}}}/>
  )
}
