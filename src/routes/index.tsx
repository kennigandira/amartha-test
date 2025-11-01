import { createFileRoute } from "@tanstack/react-router";
import { LinkButton } from "@/components/LinkButton";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="text-zinc-800">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-center font-extrabold">Our Team</h1>
        <LinkButton to="/wizard">Add Employee</LinkButton>
      </div>
      <div className="border-double border-4 border-zinc-400 p-4 flex gap-2 rounded-3xl mb-5">
        <img
          width={80}
          height={80}
          className="aspect-square object-cover rounded-full border-2 border-zinc-400"
          src="https://images.unsplash.com/photo-1511806754518-53bada35f930"
        />
        <div>
          <div>
            <span className="font-bold mr-2 text-2xl">Nate Foss</span>
          </div>
          <div className="text-sm">Engineer</div>
          <div className="mt-2">Engineering Department in Jakarta</div>
        </div>
      </div>
      <div className="border-double border-4 border-zinc-400 p-4 flex gap-2 rounded-3xl mb-5">
        <img
          width={80}
          height={80}
          className="aspect-square object-cover rounded-full border-2 border-zinc-400"
          src="https://images.unsplash.com/photo-1511806754518-53bada35f930"
        />
        <div className="text-zinc-800">
          <div>
            <span className="font-bold mr-2 text-2xl">Nate Foss</span>
          </div>
          <div className="text-sm">Engineer</div>
          <div className="mt-2">Engineering Department in Jakarta</div>
        </div>
      </div>
    </div>
  );
}
