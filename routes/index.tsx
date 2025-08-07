import Todos from "../islands/Todos.tsx";

export default function Home() {
  return (
    <div className="bg-grey-200">
      <div className="mt-10 px-5 rounded bg-white mx-auto flex w-screen flex-col justify-center py-12">
        <div className="mx-auto">
          <img
            className="mx-auto w-20 h-20"
            src="/optimus.png"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h1 className="text-2xl mb-5 text-center font-bold italic">
            OP Todo App
          </h1>
        </div>
      </div>
      <Todos />
    </div>
  );
}
