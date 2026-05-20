import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import {
  Search, Moon, Infinity as InfinityIcon, Sun, User, Shield,
  Skull, Eye, VolumeX, Plus, Crosshair, Sword, RefreshCw,
  QrCode, Sparkles, ScrollText, Lightbulb, ChevronDown, ChevronRight,
  Layers, Palette, Type, Smartphone, Hash, Quote, X, Info,
} from "lucide-react";

import havalImg from "@/assets/haval-brinston.jpg";
import crystalImg from "@/assets/crystal-boulevard.jpg";
import edwardImg from "@/assets/edward-choice.jpg";
import caimImg from "@/assets/caim-graves.jpg";
import liviaImg from "@/assets/livia-moraes.jpg";
import { Editable, EditableImage, EditToolbar } from "@/components/Editable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SVR — Survivor · Sistema de Cartas Cinematográficas" },
      { name: "description", content: "Apresentação interativa do sistema SVR Survivor: cartas com frente cinematográfica, verso funcional e regras escaláveis via QR Code." },
      { property: "og:title", content: "SVR — Survivor · Sistema de Cartas" },
    ],
  }),
  component: Index,
});

/* ============================================================
   TEAM BADGE — hexagonal shield like in the reference
   ============================================================ */
function TeamBadge({ team = "BEM", size = "md" }: { team?: string; size?: "sm" | "md" }) {
  const color =
    team === "MAL" ? "var(--team-mal)" :
    team === "NEUTRO" ? "var(--team-neutro)" :
    team === "INDEPENDENTE" ? "var(--team-ind)" :
    "var(--team-bem)";
  const w = size === "sm" ? "w-8 h-10" : "w-11 h-14";
  return (
    <div className="flex flex-col items-center gap-1 pointer-events-none">
      <div
        className={`relative ${w} flex items-center justify-center`}
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: `linear-gradient(180deg, ${color}, oklch(0.12 0.02 250))`,
          boxShadow: `inset 0 0 0 1px ${color}`,
        }}
      >
        <Shield className="w-5 h-5 text-white/95" strokeWidth={1.4} />
      </div>
      <div className="text-[7px] tracking-[0.22em] text-white/80 font-bold text-center leading-tight">
        TIME<br />{team}
      </div>
    </div>
  );
}

/* ============================================================
   QR CODE — purely decorative SVG grid
   ============================================================ */
function FakeQR({ size = 64 }: { size?: number }) {
  const cells = 9;
  const pattern: number[] = Array.from({ length: cells * cells }, (_, i) => {
    const x = i % cells, y = Math.floor(i / cells);
    // finder squares
    if ((x < 3 && y < 3) || (x > cells - 4 && y < 3) || (x < 3 && y > cells - 4)) {
      const lx = x % 3, ly = y % 3;
      return (lx === 0 || lx === 2 || ly === 0 || ly === 2 || (lx === 1 && ly === 1)) ? 1 : 0;
    }
    return (x * 7 + y * 13 + (x ^ y) * 3) % 3 === 0 ? 1 : 0;
  });
  return (
    <div className="rounded-md bg-white p-2" style={{ width: size + 16, height: size + 16 }}>
      <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${cells}, 1fr)`, gap: 1 }}>
        {pattern.map((v, i) => <div key={i} style={{ background: v ? "#000" : "transparent" }} />)}
      </div>
    </div>
  );
}

/* ============================================================
   HOTSPOT — click-to-explain dot
   ============================================================ */
function Hotspot({
  x, y, label, body, active, onClick,
}: { x: string; y: string; label: string; body: string; active: boolean; onClick: () => void; }) {
  return (
    <button
      onClick={onClick}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: x, top: y }}
      aria-label={label}
    >
      <span className="relative flex">
        <span className={`absolute inline-flex h-full w-full rounded-full ${active ? "bg-primary/40" : "bg-primary/30"} animate-ping`} />
        <span className={`relative inline-flex rounded-full h-4 w-4 ${active ? "bg-primary border-2 border-white" : "bg-primary/90 border border-white/80"}`} />
      </span>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute left-1/2 top-6 -translate-x-1/2 w-64 z-30 text-left"
          >
            <div className="card-frame rounded-lg p-3 shadow-cinematic">
              <div className="text-[10px] tracking-[0.25em] text-primary font-semibold mb-1">{label}</div>
              <div className="text-[11px] text-white/80 leading-snug">{body}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ============================================================
   CARD FRONT (full-size interactive)
   ============================================================ */
function CardFront({ interactive = false }: { interactive?: boolean }) {
  const [hot, setHot] = useState<number | null>(null);
  const hotspots = [
    { x: "16%", y: "10%", label: "ÍCONE DO TIME", body: "Brasão hexagonal com a cor do time. Permite leitura instantânea da facção antes mesmo de ler o nome." },
    { x: "85%", y: "10%", label: "EDIÇÃO E VERSÃO", body: "ED. controla expansões; VER. marca revisões de regras. Coleções e balance ficam rastreáveis." },
    { x: "50%", y: "45%", label: "ARTE CINEMATOGRÁFICA", body: "Cada personagem recebe iluminação, paleta e direção próprias — a carta vira retrato narrativo." },
    { x: "50%", y: "75%", label: "NOME E FUNÇÃO", body: "Tipografia display em maiúsculas, hierarquia clara: nome do personagem acima, função abaixo." },
    { x: "50%", y: "92%", label: "MARCA SVR", body: "Selo da família Survivor — assinatura visual constante em todas as cartas e expansões." },
  ];
  return (
    <div className="absolute inset-0 backface-hidden card-frame rounded-[18px] overflow-hidden noise">
      <EditableImage id="hero-front-img" src={havalImg} alt="Haval Brinston" className="absolute inset-0 w-full h-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background pointer-events-none" />
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        <TeamBadge team="BEM" />
        <div className="text-right text-[10px] tracking-[0.2em] text-white/70 font-semibold">
          <div><Editable id="hero-front-ed" as="span">ED. 003</Editable></div>
          <div className="mt-1"><Editable id="hero-front-ver" as="span">VER. 01</Editable></div>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 px-6 text-center z-10">
        <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-none tracking-wide">
          <Editable id="hero-front-name" as="span">HAVAL BRINSTON</Editable>
        </h3>
        <div className="mt-3 inline-flex items-center gap-3">
          <span className="h-px w-8 bg-primary/60" />
          <Editable id="hero-front-role" as="span" className="font-display text-sm tracking-[0.4em] text-primary">DETETIVE</Editable>
          <span className="h-px w-8 bg-primary/60" />
        </div>
        <div className="mt-6 flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-blue-glow)", boxShadow: "var(--shadow-glow)" }}>
            <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div className="font-display text-[10px] tracking-[0.35em] text-white/70 mt-1">SVR</div>
          <div className="text-[8px] tracking-[0.3em] text-white/40">SURVIVOR</div>
        </div>
      </div>

      {interactive && hotspots.map((h, i) => (
        <Hotspot key={i} {...h} active={hot === i} onClick={() => setHot(hot === i ? null : i)} />
      ))}
    </div>
  );
}

/* ============================================================
   CARD BACK
   ============================================================ */
function StatRow({ icon: Icon, label, value, id }: { icon: any; label: string; value: string; id: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-b-0">
      <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" strokeWidth={1.6} />
      </div>
      <Editable id={`${id}-l`} className="text-[11px] tracking-[0.2em] text-white/60 font-semibold flex-1">{label}</Editable>
      <Editable id={`${id}-v`} className="text-[12px] tracking-[0.15em] text-white font-semibold">{value}</Editable>
    </div>
  );
}

function CardBack({ interactive = false }: { interactive?: boolean }) {
  const [hot, setHot] = useState<number | null>(null);
  const hotspots = [
    { x: "50%", y: "8%", label: "CABEÇALHO", body: "Nome + função fixos. O brasão do time se repete para reforçar identidade durante a leitura rápida." },
    { x: "50%", y: "36%", label: "ATRIBUTOS", body: "Seis atributos padronizados: Mecânica, Período, Uso, Alvos, Trabalho e Grupo. Tudo que define a carta em um piscar." },
    { x: "50%", y: "62%", label: "DESCRIÇÃO ESSENCIAL", body: "Resumo curto da habilidade — o suficiente para jogar sem consultar o livro de regras." },
    { x: "50%", y: "82%", label: "PONTUAÇÃO", body: "Como a carta soma ou subtrai pontos. Cores indicam efeitos positivos, negativos ou neutros." },
    { x: "22%", y: "94%", label: "QR CODE", body: "Aponte o celular para abrir a ficha completa: descrição, pontuação detalhada e regras específicas." },
  ];
  return (
    <div className="absolute inset-0 backface-hidden rotate-y-180 card-frame rounded-[18px] overflow-hidden p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4 z-10">
        <div>
          <h3 className="font-display text-xl font-bold text-white leading-none">
            <Editable id="hero-back-name">HAVAL BRINSTON</Editable>
          </h3>
          <Editable id="hero-back-role" className="font-display text-[11px] tracking-[0.35em] text-primary mt-1.5 block">DETETIVE</Editable>
        </div>
        <TeamBadge team="BEM" size="sm" />
      </div>

      <div className="rounded-md bg-black/30 border border-white/5 px-3 py-1">
        <StatRow id="s1" icon={Search} label="MECÂNICA" value="INVESTIGAR" />
        <StatRow id="s2" icon={Moon} label="PERÍODO" value="NOITE" />
        <StatRow id="s3" icon={InfinityIcon} label="USO" value="CONTÍNUO" />
        <StatRow id="s4" icon={Sun} label="ALVOS" value="ÚNICO" />
        <StatRow id="s5" icon={User} label="TRABALHO" value="INDIVIDUAL" />
        <StatRow id="s6" icon={Shield} label="GRUPO" value="DELEGACIA" />
      </div>

      <div className="mt-3 rounded-md border border-primary/20 bg-primary/[0.04] p-3">
        <div className="text-[10px] tracking-[0.25em] text-primary font-semibold mb-1.5">DESCRIÇÃO</div>
        <Editable id="hero-back-desc" multiline className="text-[11px] leading-snug text-white/75 block">
          Toda noite indica um jogador para ser investigado. Investigações contra o Detetive sempre têm sucesso na identificação do time do alvo.
        </Editable>
      </div>

      <div className="mt-3 rounded-md border border-white/5 bg-black/20 p-2.5 space-y-1">
        <div className="text-[9px] tracking-[0.25em] text-primary/80 font-semibold">PONTUAÇÃO</div>
        <div className="flex items-start gap-2 text-[10px] text-white/70"><span className="w-2 h-2 mt-1 rounded-sm bg-[var(--team-bem)]" /><span><b className="text-white">POSITIVA:</b> ao investigar com sucesso um jogador do time mal.</span></div>
        <div className="flex items-start gap-2 text-[10px] text-white/70"><span className="w-2 h-2 mt-1 rounded-sm bg-[var(--team-mal)]" /><span><b className="text-white">NEGATIVA:</b> ao investigar um jogador do time bem.</span></div>
        <div className="flex items-start gap-2 text-[10px] text-white/70"><span className="w-2 h-2 mt-1 rounded-sm bg-white/40" /><span><b className="text-white">NEUTRA:</b> se falhar ou se não investigar.</span></div>
      </div>

      <div className="mt-auto pt-3 flex items-end justify-between">
        <FakeQR size={56} />
        <div className="text-right text-[8px] tracking-[0.25em] text-white/40">
          ED. 003 &nbsp;·&nbsp; VER. 01
        </div>
      </div>

      {interactive && hotspots.map((h, i) => (
        <Hotspot key={i} {...h} active={hot === i} onClick={() => setHot(hot === i ? null : i)} />
      ))}
    </div>
  );
}

/* ============================================================
   FLIP CARD wrapper
   ============================================================ */
function FlipCard({ interactive = false }: { interactive?: boolean }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="perspective-1000 w-full max-w-[360px] aspect-[2/3] mx-auto">
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <CardFront interactive={interactive && !flipped} />
        <CardBack interactive={interactive && flipped} />
      </motion.div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="px-5 py-2.5 rounded-full text-[11px] tracking-[0.3em] font-semibold text-white border border-primary/40 bg-primary/10 hover:bg-primary/20 transition"
        >
          VIRAR CARTA · {flipped ? "VER FRENTE" : "VER VERSO"}
        </button>
      </div>
      {interactive && (
        <div className="mt-3 text-center text-[10px] tracking-[0.25em] text-white/40 flex items-center justify-center gap-1.5">
          <Info className="w-3 h-3" /> CLIQUE NOS PONTOS AZUIS PARA EXPLICAÇÕES
        </div>
      )}
    </div>
  );
}

/* ============================================================
   VARIATIONS
   ============================================================ */
const variations = [
  {
    id: "crystal", name: "CRYSTAL BOULEVARD", role: "ASSASSINA",
    team: "MAL", subteam: "ASSASSINOS", img: crystalImg, color: "var(--team-mal)",
    mech: "MATAR", period: "NOITE",
    bio: "Ex-bailarina convertida em arma silenciosa. Caça alvos sob ordem do conselho dos assassinos — nunca sob impulso próprio.",
    rule: "Toda noite, em consenso com seu time, escolhe um alvo para matar. Não pode atacar o próprio time. Falha se houver Médica protegendo o alvo.",
  },
  {
    id: "edward", name: "EDWARD CHOICE", role: "EMBAIXADOR",
    team: "NEUTRO", subteam: "SOLO", img: edwardImg, color: "var(--team-neutro)",
    mech: "DESCOBRIR", period: "DIA",
    bio: "Diplomata aposentado, agora árbitro silencioso. Vence sozinho se sobreviver até o fim de qualquer partida.",
    rule: "Uma vez por dia pode revelar publicamente a função de outro jogador. Conquista a vitória solo se permanecer vivo até o último turno.",
  },
  {
    id: "caim", name: "CAIM GRAVES", role: "LÍDER DO CULTO",
    team: "INDEPENDENTE", subteam: "CULTO", img: caimImg, color: "var(--team-ind)",
    mech: "CONVERTER", period: "NOITE",
    bio: "Pregador de uma fé proibida. Cresce em silêncio até dominar a partida pela conversão de almas.",
    rule: "Toda noite pode tentar converter um jogador. Vitória do culto ocorre quando metade ou mais dos vivos pertence à seita.",
  },
  {
    id: "livia", name: "LÍVIA MORAES", role: "MÉDICA",
    team: "BEM", subteam: "HOSPITAL", img: liviaImg, color: "var(--team-bem)",
    mech: "SALVAR", period: "NOITE",
    bio: "Cirurgiã do plantão noturno. Faz mais cirurgias por intuição do que por protocolo — e quase nunca erra.",
    rule: "Toda noite escolhe um jogador para proteger. Se o alvo for atacado, sobrevive. Não pode proteger a si mesma em noites consecutivas.",
  },
];

/* ============================================================
   ACCORDION
   ============================================================ */
function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/8 card-frame rounded-2xl overflow-hidden">
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition"
          >
            <span className="font-display text-base md:text-lg text-white tracking-wide flex-1">{it.q}</span>
            <ChevronRight className={`w-5 h-5 text-primary transition-transform ${open === i ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-6 text-sm text-white/70 leading-relaxed max-w-2xl">{it.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   SECTION LABEL
   ============================================================ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-3 text-xs tracking-[0.4em] text-primary font-semibold"
    >
      <span className="h-px w-8 bg-primary/60" />
      {children}
      <span className="h-px w-8 bg-primary/60" />
    </motion.div>
  );
}

/* ============================================================
   ICONS REFERENCE — with descriptions
   ============================================================ */
const iconList = [
  { icon: Search, label: "INVESTIGAR", desc: "Revela o time de um jogador alvo durante a noite." },
  { icon: Skull, label: "MATAR", desc: "Elimina o alvo se nenhuma proteção for ativada." },
  { icon: Plus, label: "SALVAR", desc: "Protege um jogador contra ataques noturnos." },
  { icon: Eye, label: "DESCOBRIR", desc: "Revela a função (não só o time) de um alvo." },
  { icon: VolumeX, label: "SILENCIAR", desc: "Impede o alvo de usar habilidades por um turno." },
  { icon: Sparkles, label: "REVIVER", desc: "Devolve um jogador eliminado à partida." },
  { icon: Sun, label: "ATORDOAR", desc: "Cancela a próxima ação do alvo sem revelá-lo." },
  { icon: Crosshair, label: "MARCAÇÃO", desc: "Marca um alvo para efeito futuro acumulado." },
  { icon: Sword, label: "ASSASSINAR", desc: "Ataque dirigido que ignora proteções comuns." },
  { icon: RefreshCw, label: "CONVERTER", desc: "Muda o time do alvo para a facção do conversor." },
];

/* ============================================================
   MAIN PAGE
   ============================================================ */
function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const [activeVar, setActiveVar] = useState(0);

  return (
    <main className="min-h-screen text-foreground">
      <EditToolbar />

      {/* ============== NAV ============== */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-blue-glow)" }}>
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="font-display text-lg tracking-[0.3em] text-white">SVR</div>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-[11px] tracking-[0.25em] text-white/60 font-semibold">
            <a href="#anatomia" className="hover:text-white transition">ANATOMIA</a>
            <a href="#fluxo" className="hover:text-white transition">FLUXO QR</a>
            <a href="#icones" className="hover:text-white transition">ÍCONES</a>
            <a href="#variacoes" className="hover:text-white transition">PERSONAGENS</a>
            <a href="#sistema" className="hover:text-white transition">SISTEMA</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>
          <div className="text-[10px] tracking-[0.3em] text-white/40">ED. 003 · VER. 01</div>
        </div>
      </header>

      {/* ============== HERO ============== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <SectionLabel>SISTEMA DE CARTAS · SURVIVOR</SectionLabel>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white mt-6 leading-[0.95] text-balance">
              <Editable id="hero-h1-a">Cartas que</Editable> <br />
              <em className="italic font-medium" style={{ color: "var(--gold)" }}><Editable id="hero-h1-em">contam</Editable></em> <Editable id="hero-h1-b">uma história.</Editable>
            </h1>
            <Editable id="hero-sub" multiline as="p" className="mt-8 text-lg text-white/70 max-w-xl leading-relaxed block">
              Uma frente cinematográfica para impactar. Um verso funcional para jogar. E um QR Code para revelar todas as regras — sem poluir a mesa, sem reimprimir o baralho.
            </Editable>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a href="#anatomia" className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.2em] text-primary-foreground"
                 style={{ background: "var(--gradient-blue-glow)", boxShadow: "var(--shadow-glow)" }}>
                EXPLORAR A CARTA
                <ChevronDown className="w-4 h-4 transition group-hover:translate-y-0.5" />
              </a>
              <a href="#fluxo" className="text-sm tracking-[0.25em] text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-1 transition">
                COMO FUNCIONA
              </a>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-md">
              {[
                { kid: "k1", k: "10+", vid: "v1", v: "MECÂNICAS" },
                { kid: "k2", k: "4", vid: "v2", v: "TIMES" },
                { kid: "k3", k: "∞", vid: "v3", v: "EXPANSÕES" },
              ].map((s, i) => (
                <motion.div key={s.v} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <Editable id={s.kid} className="font-display text-3xl text-white block">{s.k}</Editable>
                  <Editable id={s.vid} className="text-[10px] tracking-[0.3em] text-white/40 mt-1 block">{s.v}</Editable>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 blur-3xl opacity-50" style={{ background: "var(--gradient-blue-glow)" }} />
            <div className="relative"><FlipCard /></div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30">
          <ChevronDown />
        </motion.div>
      </section>

      {/* ============== ANATOMIA — faithful to reference ============== */}
      <section id="anatomia" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <SectionLabel>ANATOMIA DA CARTA</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 text-balance">
              <Editable id="anat-h2-a">Frente de</Editable> <em className="not-italic font-medium" style={{ color: "var(--gold)" }}><Editable id="anat-h2-em">impacto</Editable></em>.<br />
              <Editable id="anat-h2-b">Verso de jogabilidade.</Editable>
            </h2>
            <Editable id="anat-sub" multiline as="p" className="mt-6 text-white/65 max-w-2xl mx-auto block">
              Toque nos pontos azuis sobre cada carta para entender a função de cada elemento — da arte ao QR Code.
            </Editable>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* FRONT */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <div className="text-[10px] tracking-[0.4em] text-primary mb-6 text-center">FRENTE · IMPACTO</div>
              <div className="max-w-[380px] aspect-[2/3] mx-auto relative">
                <CardFront interactive />
              </div>
            </motion.div>
            {/* BACK */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.15 }}>
              <div className="text-[10px] tracking-[0.4em] text-primary mb-6 text-center">VERSO · JOGABILIDADE</div>
              <div className="max-w-[380px] aspect-[2/3] mx-auto relative">
                <CardBack interactive />
              </div>
            </motion.div>
          </div>

          {/* Anatomy details accordion */}
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <SectionLabel>DETALHES DE CADA ELEMENTO</SectionLabel>
            </div>
            <Accordion items={[
              { q: "Ícone do time — o brasão hexagonal", a: "O brasão hexagonal foi escolhido por evocar emblemas de patente e selos heráldicos. Cada time tem cor própria (azul para o Bem, vermelho para o Mal, dourado para o Neutro, púrpura para o Independente), permitindo que jogadores leiam a facção mesmo à distância e mesmo de cabeça para baixo na mesa." },
              { q: "Edição e versão — controle de expansões", a: "ED. indica a coleção (cada expansão temática recebe um número). VER. controla revisões de balanceamento sem precisar reimprimir tudo: se uma habilidade é ajustada, basta atualizar o QR Code e incrementar a versão. O time pode reconhecer rapidamente se está jogando com cartas defasadas." },
              { q: "Arte cinematográfica — narrativa visual", a: "Cada carta é tratada como pôster de cinema. A direção de arte garante composição, profundidade e tom dramático coerente com o time. Personagens do Mal têm iluminação fria e ângulos baixos; personagens do Bem aparecem com luz direcional e expressão alerta; Neutros vivem entre sombras quentes; Independentes habitam paletas saturadas e simbólicas." },
              { q: "Atributos padronizados — leitura em segundos", a: "Mecânica (o que a carta faz), Período (quando age — dia, noite, contínuo), Uso (única vez, contínuo, limitado), Alvos (único, múltiplos, área), Trabalho (individual, conjunto, líder) e Grupo (a facção interna que pertence). Seis linhas, mesma ordem em todo o baralho." },
              { q: "QR Code — regras vivas", a: "O QR aponta para a ficha completa hospedada na nuvem. Isso permite errata, exemplos e até pequenos vídeos explicativos sem reimprimir nada. Em mesa, ele permanece silencioso; quando o jogador precisa do detalhe, basta o celular." },
              { q: "Tipografia — Cinzel + Inter", a: "Cinzel (display) traz peso clássico, quase epigráfico, ideal para nomes e títulos. Inter (texto) garante legibilidade impecável em corpos pequenos do verso. O contraste entre os dois cria hierarquia sem usar muitas cores." },
            ]} />
          </div>
        </div>
      </section>

      {/* ============== FLUXO QR — phone illustration ============== */}
      <section id="fluxo" className="relative py-32 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <SectionLabel>COMO FUNCIONA</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 text-balance">
              <Editable id="fluxo-h2-a">Escaneie.</Editable> <span style={{ color: "var(--gold)" }}><Editable id="fluxo-h2-em">Descubra.</Editable></span> <Editable id="fluxo-h2-b">Jogue.</Editable>
            </h2>
          </div>

          {/* Phone flow */}
          <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {/* Verso compact */}
            <div className="relative">
              <div className="aspect-[9/16] max-w-[200px] mx-auto rounded-2xl bg-black border-4 border-white/10 p-3 flex flex-col">
                <div className="text-[8px] tracking-[0.25em] text-white/80 font-bold">HAVAL BRINSTON</div>
                <div className="text-[7px] tracking-[0.25em] text-primary mt-0.5">DETETIVE</div>
                <div className="flex-1 mt-2 rounded bg-white/5" />
                <div className="mt-2 mx-auto"><FakeQR size={50} /></div>
                <div className="mt-1 text-center text-[6px] tracking-[0.3em] text-white/30">SVR</div>
              </div>
              <div className="mt-4 text-center text-[10px] tracking-[0.3em] text-white/50">01 · VERSO LIMPO</div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative aspect-[9/16] w-[180px] rounded-[2rem] bg-black border-4 border-white/15 shadow-cinematic p-4 flex flex-col items-center justify-center">
                <Smartphone className="w-12 h-12 text-primary mb-3" strokeWidth={1.2} />
                <FakeQR size={80} />
                <div className="mt-4 text-[9px] tracking-[0.3em] text-white/60">ESCANEANDO…</div>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-white/50 whitespace-nowrap">02 · ESCANEIE O QR</div>
            </div>

            <div className="relative">
              <div className="aspect-[9/16] max-w-[200px] mx-auto rounded-2xl bg-black border-4 border-white/10 p-3 flex flex-col text-left">
                <div className="text-[8px] tracking-[0.25em] text-white font-bold">HAVAL BRINSTON</div>
                <div className="text-[7px] tracking-[0.25em] text-primary mt-0.5">DETETIVE</div>
                <div className="mt-2 space-y-1.5 text-[6.5px] leading-snug text-white/70">
                  <div><b className="text-primary tracking-widest">DESCRIÇÃO COMPLETA</b><br/>Toda noite indica um jogador para ser investigado. Pode escolher o mesmo jogador consecutivamente.</div>
                  <div><b className="text-primary tracking-widest">PONTUAÇÃO DETALHADA</b><br/>Positiva ao investigar membro do mal. Negativa contra o bem.</div>
                  <div><b className="text-primary tracking-widest">REGRAS ESPECÍFICAS</b><br/>Investigações contra o Detetive sempre têm sucesso.</div>
                </div>
              </div>
              <div className="mt-4 text-center text-[10px] tracking-[0.3em] text-white/50">03 · FICHA COMPLETA</div>
            </div>
          </div>

          {/* Vantagens */}
          <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { id: "va1", t: "Verso limpo e funcional durante o jogo." },
              { id: "va2", t: "Reduz poluição visual na mesa." },
              { id: "va3", t: "Acesso rápido e completo via QR Code." },
              { id: "va4", t: "Facilita atualizações de regras e descrições." },
            ].map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-5 rounded-xl border border-primary/15 bg-primary/[0.03]">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <Editable id={a.id} multiline className="text-sm text-white/80 leading-snug block">{a.t}</Editable>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== ÍCONES ============== */}
      <section id="icones" className="relative py-32 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>LINGUAGEM VISUAL</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 text-balance">
              <Editable id="icon-h2">Ícones e significados</Editable>
            </h2>
            <Editable id="icon-sub" multiline as="p" className="mt-6 text-white/65 max-w-2xl mx-auto block">
              Toque em qualquer ícone para ler o efeito mecânico que ele representa no sistema.
            </Editable>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {iconList.map((it, i) => (
              <IconCard key={it.label} it={it} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============== PERSONAGENS / VARIAÇÕES ============== */}
      <section id="variacoes" className="relative py-32 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>VARIAÇÕES POR TIME</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 text-balance">
              <Editable id="var-h2-a">Quatro times.</Editable> <span style={{ color: "var(--gold)" }}><Editable id="var-h2-em">Infinitas histórias.</Editable></span>
            </h2>
          </div>

          {/* Mini cards row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {variations.map((v, i) => (
              <motion.button
                key={v.id}
                onClick={() => setActiveVar(i)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.7 }}
                whileHover={{ y: -8 }}
                className={`group text-left transition ${activeVar === i ? "scale-[1.02]" : "opacity-80"}`}
              >
                <div className="text-center mb-3">
                  <div className="text-[10px] tracking-[0.3em] font-bold" style={{ color: v.color }}>TIME {v.team}</div>
                  <div className="text-[9px] tracking-[0.25em] text-white/40 mt-0.5">({v.subteam})</div>
                </div>
                <div className={`relative aspect-[2/3] rounded-xl overflow-hidden card-frame noise transition ${activeVar === i ? "ring-2" : ""}`}
                  style={activeVar === i ? { boxShadow: `0 0 40px ${v.color}` } as React.CSSProperties : {}}>
                  <EditableImage id={`var-${v.id}-img`} src={v.img} alt={v.name} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between text-[8px] tracking-[0.2em] text-white/80 font-semibold">
                    <div className="px-1.5 py-0.5 rounded border border-white/10 bg-black/40">{v.team}</div>
                    <div className="text-right opacity-60">ED. 003<br />VER. 01</div>
                  </div>
                  <div className="absolute bottom-5 left-0 right-0 text-center px-3">
                    <Editable id={`var-${v.id}-name`} className="font-display text-lg font-bold text-white leading-tight block">{v.name}</Editable>
                    <Editable id={`var-${v.id}-role`} className="mt-1.5 text-[9px] tracking-[0.35em] block" style={{ color: v.color }}>{v.role}</Editable>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVar}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
              className="card-frame rounded-2xl p-8 md:p-10 grid md:grid-cols-3 gap-8"
            >
              <div>
                <div className="text-[10px] tracking-[0.3em] mb-2" style={{ color: variations[activeVar].color }}>TIME {variations[activeVar].team} · {variations[activeVar].subteam}</div>
                <h3 className="font-display text-3xl text-white">
                  <Editable id={`var-${variations[activeVar].id}-name-2`}>{variations[activeVar].name}</Editable>
                </h3>
                <Editable id={`var-${variations[activeVar].id}-role-2`} className="font-display text-sm tracking-[0.3em] mt-1 block" style={{ color: variations[activeVar].color }}>
                  {variations[activeVar].role}
                </Editable>
                <div className="mt-6 flex flex-wrap gap-2 text-[10px] tracking-[0.2em]">
                  <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">MECÂNICA: {variations[activeVar].mech}</span>
                  <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">PERÍODO: {variations[activeVar].period}</span>
                </div>
              </div>
              <div className="md:col-span-2 space-y-5">
                <div>
                  <div className="text-[10px] tracking-[0.3em] text-primary font-semibold mb-2 flex items-center gap-2"><Quote className="w-3.5 h-3.5" /> BIOGRAFIA</div>
                  <Editable id={`var-${variations[activeVar].id}-bio`} multiline as="p" className="text-white/75 leading-relaxed block">
                    {variations[activeVar].bio}
                  </Editable>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.3em] text-primary font-semibold mb-2 flex items-center gap-2"><ScrollText className="w-3.5 h-3.5" /> REGRA NA MESA</div>
                  <Editable id={`var-${variations[activeVar].id}-rule`} multiline as="p" className="text-white/75 leading-relaxed block">
                    {variations[activeVar].rule}
                  </Editable>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ============== SISTEMA — palette + typography ============== */}
      <section id="sistema" className="relative py-32 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>SISTEMA DE DESIGN</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 text-balance">
              <Editable id="sis-h2">A gramática visual do baralho</Editable>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Palette */}
            <div className="card-frame rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="font-display text-xl text-white tracking-wide">PALETA</h3>
              </div>
              <div className="space-y-3">
                {[
                  { c: "var(--team-bem)", n: "TIME BEM", h: "Azul investigação" },
                  { c: "var(--team-mal)", n: "TIME MAL", h: "Vermelho ameaça" },
                  { c: "var(--team-neutro)", n: "TIME NEUTRO", h: "Dourado ambíguo" },
                  { c: "var(--team-ind)", n: "TIME INDEPENDENTE", h: "Púrpura misticismo" },
                ].map((p) => (
                  <div key={p.n} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md" style={{ background: p.c, boxShadow: `0 0 30px ${p.c}` }} />
                    <div>
                      <div className="text-xs tracking-[0.25em] text-white font-semibold">{p.n}</div>
                      <div className="text-[10px] text-white/50">{p.h}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="card-frame rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Type className="w-5 h-5 text-primary" />
                <h3 className="font-display text-xl text-white tracking-wide">TIPOGRAFIA</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] tracking-[0.3em] text-primary mb-2">DISPLAY · CINZEL</div>
                  <div className="font-display text-4xl text-white tracking-wider">SURVIVOR</div>
                  <div className="text-[11px] text-white/50 mt-1">Para nomes, títulos e selos. Peso epigráfico.</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.3em] text-primary mb-2">TEXTO · INTER</div>
                  <div className="text-base text-white leading-snug">Leitura impecável em corpos pequenos do verso.</div>
                  <div className="text-[11px] text-white/50 mt-1">Para descrições, regras e atributos.</div>
                </div>
              </div>
            </div>

            {/* Grid / proporções */}
            <div className="card-frame rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Layers className="w-5 h-5 text-primary" />
                <h3 className="font-display text-xl text-white tracking-wide">PROPORÇÕES</h3>
              </div>
              <div className="space-y-4 text-sm text-white/70">
                <div className="flex justify-between border-b border-white/10 pb-2"><span>Formato</span><span className="text-white font-mono">2 : 3</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span>Margem segura</span><span className="text-white font-mono">8%</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span>Raio das bordas</span><span className="text-white font-mono">18px</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span>QR mínimo</span><span className="text-white font-mono">56×56</span></div>
                <div className="flex justify-between"><span>Brasão</span><span className="text-white font-mono">hex 6 lados</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== OBSERVAÇÕES ============== */}
      <section className="relative py-24 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>OBSERVAÇÕES IMPORTANTES</SectionLabel>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: "o1", icon: Lightbulb, t: "Ícones padronizados garantem leitura rápida e compreensão imediata durante o jogo." },
              { id: "o2", icon: Shield, t: "Edição e versão na frente facilitam controle de atualizações e expansões." },
              { id: "o3", icon: QrCode, t: "QR Code pode ser atualizado sem precisar reimprimir as cartas." },
            ].map((o, i) => (
              <motion.div key={o.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center mb-5">
                  <o.icon className="w-6 h-6 text-primary" strokeWidth={1.4} />
                </div>
                <Editable id={o.id} multiline as="p" className="text-white/75 leading-relaxed max-w-xs mx-auto block">{o.t}</Editable>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section id="faq" className="relative py-32 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>PERGUNTAS FREQUENTES</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 text-balance">
              <Editable id="faq-h2">Dúvidas frequentes</Editable>
            </h2>
          </div>
          <Accordion items={[
            { q: "Preciso de internet para jogar?", a: "Não. O verso da carta tem tudo o que você precisa para jogar uma partida básica. O QR Code só é necessário quando alguém quer detalhes, errata ou exemplos de uso." },
            { q: "Como funcionam as expansões?", a: "Cada expansão recebe um número de edição (ED. 004, ED. 005…) e pode conter novos times, novas mecânicas e personagens inéditos. As cartas antigas continuam compatíveis." },
            { q: "Posso editar os textos desta apresentação?", a: "Sim. Use o botão EDITAR no canto inferior direito. Cada título, parágrafo e imagem fica editável diretamente na tela, e suas alterações ficam salvas no navegador. Use RESET para restaurar tudo." },
            { q: "Como atualizo regras já impressas?", a: "Basta publicar nova ficha no destino do QR Code e incrementar a versão (VER. 02, VER. 03…). Jogadores comparam a versão impressa com a do QR para saber se estão atualizados." },
            { q: "Posso criar meu próprio personagem?", a: "Sim. O sistema foi desenhado para autoria modular: respeite a estrutura de seis atributos, escolha um time, uma mecânica e um período, e a carta encaixa no baralho sem quebrar o equilíbrio." },
          ]} />
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs tracking-[0.25em] text-white/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-display text-white">SVR</span>
            <span>· SURVIVOR</span>
          </div>
          <div><Editable id="footer-text">ED. 003 · VER. 01 · APRESENTAÇÃO DO SISTEMA DE CARTAS</Editable></div>
        </div>
      </footer>
    </main>
  );
}

/* ============================================================
   Icon card with expand-on-click
   ============================================================ */
function IconCard({ it, i }: { it: { icon: any; label: string; desc: string }; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.button
      onClick={() => setOpen((o) => !o)}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.04 }}
      whileHover={{ y: -4 }}
      className="group relative aspect-square card-frame rounded-xl flex flex-col items-center justify-center gap-3 noise text-center px-3"
      style={open ? { boxShadow: "var(--shadow-glow)", borderColor: "oklch(0.65 0.18 245 / 50%)" } : {}}
    >
      <div className="w-12 h-12 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center transition group-hover:bg-primary/15">
        <it.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
      </div>
      <div className="text-[10px] tracking-[0.3em] text-white/80 font-semibold">{it.label}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden text-[10px] text-white/65 leading-snug px-2"
          >
            {it.desc}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
