import type { BloubBot } from "@norbert_bodziony/bloub";
import type { PlushBot } from "@norbert_bodziony/bloub/plush";
import type { ComponentProps } from "solid-js";
import "./eq-mascot.css";

type FlatProps = ComponentProps<typeof BloubBot>;
type PlushProps = ComponentProps<typeof PlushBot>;
type MascotProps = Partial<Omit<FlatProps & PlushProps, "state">> & {
  identity?: string;
  state?: FlatProps["state"] | PlushProps["state"];
};

const COLORS = ["#26c6c2", "#7b8cf5", "#ffaf62", "#ff8cb8"];
const INK = "#142743";

export function EqMascot(props: MascotProps) {
  const hash = () => Array.from(props.identity ?? props.shape ?? props.character ?? "cat")
    .reduce((value, letter) => Math.imul(value ^ letter.charCodeAt(0), 16777619) >>> 0, 2166136261);
  const variant = () => hash() % 4;
  const coat = () => (hash() >>> 5) % 4;
  const accessory = () => (hash() >>> 9) % 4;
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
        {coat() === 1 && <path fill={shell()} stroke="none" d="M25 54Q22 40 42 41Q53 47 43 55Q35 65 25 54Z"/>}
        {coat() === 2 && <path fill={INK} opacity=".62" stroke="none" d="M37 34l6 1 2 10z M48 32h6l-3 12z M58 35l6-1-8 11z"/>}
        {coat() === 3 && <path fill={INK} opacity=".2" stroke="none" d="M68 37q18 9 9 26-14 2-18-10z"/>}
        <path fill="#fff" opacity=".28" stroke="none" d="M19 48l-3-20 16 8-10-2z"/>
        <path fill={INK} opacity=".18" stroke="none" d="M19 69q31 30 64-3-4 20-32 24-22-2-32-21z"/>
        <g class="eq-mascot-eyes" fill={INK} stroke="none">
          <ellipse cx="38" cy="58" rx="3.5" ry="5.5" />
          <ellipse cx="62" cy="58" rx="3.5" ry="5.5" />
        </g>
        {accessory() === 1 && <g fill="none" stroke-width="3"><circle cx="37" cy="58" r="9"/><circle cx="63" cy="58" r="9"/><path d="M46 57q4-3 8 0"/></g>}
        {accessory() === 2 && <path fill="#f3b857" d="M62 31q-4-16 9-10l4 6q13-10 15 0l-8 10-8-4z"/>}
        {accessory() === 3 && <path fill="#67cfba" d="M28 78q21 10 44-1l-7 11-13-3-9 7-10-8z"/>}
        <path fill="#ffad75" stroke="none" d="M47 65Q50 61 53 65L50 69Z" />
        <path fill="none" stroke-width="2" stroke-linecap="round" d="M44 72Q50 78 56 72" />
      </g>
    </svg>
  );
}
