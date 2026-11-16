import type { BloubBot } from "@norbert_bodziony/bloub";
import type { PlushBot } from "@norbert_bodziony/bloub/plush";
import type { ComponentProps } from "solid-js";
import "./eq-mascot.css";

type FlatProps = ComponentProps<typeof BloubBot>;
type PlushProps = ComponentProps<typeof PlushBot>;
type MascotProps = Partial<Omit<FlatProps & PlushProps, "state">> & {
  state?: FlatProps["state"] | PlushProps["state"];
};

const COLORS = ["#26c6c2", "#7b8cf5", "#ffaf62", "#ff8cb8"];
const INK = "#142743";

export function EqMascot(props: MascotProps) {
  const variant = () =>
    [...(props.shape ?? props.character ?? "eq")].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 4;
  const shell = () => props.color ?? COLORS[variant()];
  return (
    <svg
      class={`eq-mascot ${props.class ?? ""}`}
      width={props.size ?? 100}
      height={props.size ?? 100}
      viewBox="0 0 100 100"
      data-moving={props.paused === false && props.frozenAt === undefined}
      aria-hidden="true"
    >
      <g class="eq-mascot-shell" stroke={INK} stroke-width="3" stroke-linejoin="round">
        <path
          fill={shell()}
          d={
            variant() % 2 === 0
              ? "M17 53 11 22 35 32Q50 25 65 32L89 22 83 53Q92 85 50 91 8 85 17 53Z"
              : "M17 51 21 18 44 30H56L79 18 83 51Q96 84 50 91 4 84 17 51Z"
          }
        />
        <path fill="#fff7e7" d="M24 59C24 43 38 39 50 46 62 39 76 43 76 59 76 77 64 83 50 83 36 83 24 77 24 59Z" />
        <g class="eq-mascot-eyes" fill={INK} stroke="none">
          <ellipse cx="38" cy="58" rx="3.5" ry="5.5" />
          <ellipse cx="62" cy="58" rx="3.5" ry="5.5" />
        </g>
        <path fill="#ffad75" stroke="none" d="M47 65Q50 61 53 65L50 69Z" />
        <path fill="none" stroke-width="2" stroke-linecap="round" d="M44 72Q50 78 56 72" />
      </g>
    </svg>
  );
}
