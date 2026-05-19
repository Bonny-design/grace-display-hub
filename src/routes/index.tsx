import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import {
  Search, Moon, Infinity as InfinityIcon, Sun, User, Shield,
  Skull, Eye, VolumeX, Plus, Crosshair, Sword, RefreshCw,
  QrCode, Sparkles, ScrollText, Lightbulb, ChevronDown,
} from "lucide-react";

import havalImg from "@/assets/haval-brinston.jpg";
import crystalImg from "@/assets/crystal-boulevard.jpg";
import edwardImg from "@/assets/edward-choice.jpg";
import caimImg from "@/assets/caim-graves.jpg";
import liviaImg from "@/assets/livia-moraes.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SVR — Survivor · Sistema de Cartas Cinematográficas" },
      { name: "description", content: "Apresentação do sistema de cartas SVR Survivor: cartas com frente cinematográfica, verso funcional e descrições completas via QR Code." },
      { property: "og:title", content: "SVR — Survivor · Sistema de Cartas" },
      { property: "og:description", content: "Cartas elegantes, jogabilidade limpa, regras escaláveis via QR Code." },
    ],
  }),
  component: Index,
});

/* ---------- Card components ---------- */

function TeamBadge({ team = "BEM" }: { team?: string }) {
  const color =
    team === "MAL" ? "var(--team-mal)" :
    team === "NEUTRO" ? "var(--team-neutro)" :
    team === "INDEPENDENTE" ? "var(--team-ind)" :
    "var(--team-bem)";
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative w-10 h-12 flex items-center justify-center"
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: `linear-gradient(180deg, ${color}, oklch(0.15 0.02 250))`,
        }}
      >
        <Shield className="w-5 h-5 text-white/90" strokeWidth={1.5} />
      </div>
      <div className="text-[8px] tracking-[0.18em] text-white/70 font-semibold">TIME<br />{team}</div>
    </div>
  );
}

function CardFront() {
  return (
    <div className="absolute inset-0 backface-hidden card-frame rounded-[18px] overflow-hidden noise">
      <img src={havalImg} alt="Haval Brinston, detetive" className="absolute inset-0 w-full h-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <TeamBadge team="BEM" />
        <div className="text-right text-[10px] tracking-[0.2em] text-white/70 font-semibold">
          <div>ED. 003</div>
          <div className="mt-1">VER. 01</div>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 px-6 text-center">
        <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-none tracking-wide">
          HAVAL<br />BRINSTON
        </h3>
        <div className="mt-3 inline-flex items-center gap-3">
          <span className="h-px w-8 bg-primary/60" />
          <span className="font-display text-sm tracking-[0.4em] text-primary">DETETIVE</span>
          <span className="h-px w-8 bg-primary/60" />
        </div>
        <div className="mt-6 flex flex-col items-center gap-1">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "var(--gradient-blue-glow)", boxShadow: "var(--shadow-glow)" }}
          >
            <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div className="font-display text-[10px] tracking-[0.35em] text-white/70 mt-1">SVR</div>
          <div className="text-[8px] tracking-[0.3em] text-white/40">SURVIVOR</div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-b-0">
      <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" strokeWidth={1.6} />
      </div>
      <div className="text-[11px] tracking-[0.2em] text-white/60 font-semibold flex-1">{label}</div>
      <div className="text-[12px] tracking-[0.15em] text-white font-semibold">{value}</div>
    </div>
  );
}

function CardBack() {
  return (
    <div className="absolute inset-0 backface-hidden rotate-y-180 card-frame rounded-[18px] overflow-hidden p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-bold text-white leading-none">HAVAL BRINSTON</h3>
          <div className="font-display text-[11px] tracking-[0.35em] text-primary mt-1.5">DETETIVE</div>
        </div>
        <TeamBadge team="BEM" />
      </div>

      <div className="rounded-md bg-black/30 border border-white/5 px-3 py-1">
        <StatRow icon={Search} label="MECÂNICA" value="INVESTIGAR" />
        <StatRow icon={Moon} label="PERÍODO" value="NOITE" />
        <StatRow icon={InfinityIcon} label="USO" value="CONTÍNUO" />
        <StatRow icon={Sun} label="ALVOS" value="ÚNICO" />
        <StatRow icon={User} label="TRABALHO" value="INDIVIDUAL" />
        <StatRow icon={Shield} label="GRUPO" value="DELEGACIA" />
      </div>

      <div className="mt-3 rounded-md border border-primary/20 bg-primary/[0.04] p-3">
        <div className="text-[10px] tracking-[0.25em] text-primary font-semibold mb-1.5">DESCRIÇÃO</div>
        <p className="text-[11px] leading-snug text-white/75">
          Toda noite indica um jogador para ser investigado. Investigações contra o Detetive sempre têm sucesso na identificação do time do alvo.
        </p>
      </div>

      <div className="mt-2 flex items-end justify-between flex-1">
        <div className="rounded-md bg-white/95 p-1.5">
          <div className="w-14 h-14 grid grid-cols-6 grid-rows-6 gap-px">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className={`${[0,1,2,5,6,10,11,14,17,18,19,20,24,28,29,30,33,35].includes(i % 36) ? "bg-black" : "bg-transparent"}`} />
            ))}
          </div>
        </div>
        <div className="text-right text-[8px] tracking-[0.25em] text-white/40">
          ED. 003 &nbsp;·&nbsp; VER. 01
        </div>
      </div>
    </div>
  );
}

function FlipCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="perspective-1000 w-full max-w-[340px] aspect-[2/3] mx-auto">
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setFlipped((f) => !f)}
      >
        <CardFront />
        <CardBack />
      </motion.div>
      <div className="mt-6 text-center text-xs tracking-[0.3em] text-muted-foreground">
        CLIQUE PARA VIRAR · {flipped ? "VERSO" : "FRENTE"}
      </div>
    </div>
  );
}

/* ---------- Variation card (small) ---------- */
const variations = [
  { name: "CRYSTAL BOULEVARD", role: "ASSASSINA", team: "TIME MAL", subteam: "(ASSASSINOS)", img: crystalImg, color: "var(--team-mal)" },
  { name: "EDWARD CHOICE", role: "EMBAIXADOR", team: "TIME NEUTRO", subteam: "(SOLO)", img: edwardImg, color: "var(--team-neutro)" },
  { name: "CAIM GRAVES", role: "LÍDER DO CULTO", team: "TIME INDEPENDENTE", subteam: "(CULTO)", img: caimImg, color: "var(--team-ind)" },
  { name: "LÍVIA MORAES", role: "MÉDICA", team: "TIME BEM", subteam: "(HOSPITAL)", img: liviaImg, color: "var(--team-bem)" },
];

function MiniCard({ v, i }: { v: (typeof variations)[number]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="text-center mb-3">
        <div className="text-[10px] tracking-[0.3em] font-bold" style={{ color: v.color }}>{v.team}</div>
        <div className="text-[9px] tracking-[0.25em] text-white/40 mt-0.5">{v.subteam}</div>
      </div>
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden card-frame noise">
        <img src={v.img} alt={v.name} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        <div
          className="absolute top-3 left-3 right-3 flex items-start justify-between text-[8px] tracking-[0.2em] text-white/80 font-semibold"
        >
          <div className="px-1.5 py-0.5 rounded border border-white/10 bg-black/40">{v.team.replace("TIME ", "")}</div>
          <div className="text-right opacity-60">ED. 003<br />VER. 01</div>
        </div>
        <div className="absolute bottom-5 left-0 right-0 text-center px-3">
          <h4 className="font-display text-lg font-bold text-white leading-tight">{v.name}</h4>
          <div className="mt-1.5 text-[9px] tracking-[0.35em]" style={{ color: v.color }}>{v.role}</div>
          <div className="mt-3 font-display text-[9px] tracking-[0.3em] text-white/50">SVR</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Icons reference ---------- */
const iconList = [
  { icon: Search, label: "INVESTIGAR" },
  { icon: Skull, label: "MATAR" },
  { icon: Plus, label: "SALVAR" },
  { icon: Eye, label: "DESCOBRIR" },
  { icon: VolumeX, label: "SILENCIAR" },
  { icon: Sparkles, label: "REVIVER" },
  { icon: Sun, label: "ATORDOAR" },
  { icon: Crosshair, label: "MARCAÇÃO" },
  { icon: Sword, label: "ASSASSINAR" },
  { icon: RefreshCw, label: "CONVERTER" },
];

const advantages = [
  "Verso limpo e funcional durante o jogo.",
  "Reduz poluição visual na mesa.",
  "Acesso rápido e completo via QR Code.",
  "Facilita atualizações de regras e descrições.",
];

const observations = [
  { icon: Lightbulb, text: "Ícones padronizados garantem leitura rápida e compreensão imediata durante o jogo." },
  { icon: Shield, text: "Edição e versão na frente facilitam controle de atualizações e expansões do jogo." },
  { icon: QrCode, text: "QR Code pode ser atualizado sem precisar reimprimir as cartas." },
];

/* ---------- Section header ---------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-3 text-xs tracking-[0.4em] text-primary font-semibold"
    >
      <span className="h-px w-8 bg-primary/60" />
      {children}
    </motion.div>
  );
}

/* ---------- Main page ---------- */
function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <main className="min-h-screen text-foreground">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--gradient-blue-glow)" }}
            >
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="font-display text-lg tracking-[0.3em] text-white">SVR</div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.25em] text-white/60 font-semibold">
            <a href="#carta" className="hover:text-white transition">A CARTA</a>
            <a href="#funciona" className="hover:text-white transition">COMO FUNCIONA</a>
            <a href="#icones" className="hover:text-white transition">ÍCONES</a>
            <a href="#variacoes" className="hover:text-white transition">PERSONAGENS</a>
          </nav>
          <div className="text-[10px] tracking-[0.3em] text-white/40">ED. 003 · VER. 01</div>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 bg-gradient-hero"
        />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionLabel>SISTEMA DE CARTAS · SURVIVOR</SectionLabel>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mt-6 leading-[0.95] text-balance">
              Cartas que <br />
              <span className="italic font-medium" style={{ color: "var(--gold)" }}>contam</span> uma história.
            </h1>
            <p className="mt-8 text-lg text-white/70 max-w-xl leading-relaxed">
              Uma frente cinematográfica para impactar. Um verso funcional para jogar.
              E um QR Code para revelar todas as regras — sem poluir a mesa, sem reimprimir o baralho.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="#carta"
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold tracking-[0.2em] text-primary-foreground"
                style={{ background: "var(--gradient-blue-glow)", boxShadow: "var(--shadow-glow)" }}
              >
                EXPLORAR A CARTA
                <ChevronDown className="w-4 h-4 transition group-hover:translate-y-0.5" />
              </a>
              <a href="#funciona" className="text-sm tracking-[0.25em] text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-1 transition">
                COMO FUNCIONA
              </a>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-md">
              {[
                { k: "10+", v: "MECÂNICAS" },
                { k: "4", v: "TIMES" },
                { k: "∞", v: "EXPANSÕES" },
              ].map((s, i) => (
                <motion.div
                  key={s.v}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                >
                  <div className="font-display text-3xl text-white">{s.k}</div>
                  <div className="text-[10px] tracking-[0.3em] text-white/40 mt-1">{s.v}</div>
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
            <div className="relative">
              <FlipCard />
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
        >
          <ChevronDown />
        </motion.div>
      </section>

      {/* THE CARD */}
      <section id="carta" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <SectionLabel>ANATOMIA DA CARTA</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 text-balance">
              Frente de <em className="text-gold not-italic font-medium" style={{ color: "var(--gold)" }}>impacto</em>.<br />
              Verso de jogabilidade.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Front */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-[10px] tracking-[0.4em] text-primary mb-6 text-center">FRENTE · IMPACTO</div>
              <div className="max-w-[340px] aspect-[2/3] mx-auto relative">
                <CardFront />
              </div>
              <div className="mt-10 space-y-6 max-w-md mx-auto">
                {[
                  { t: "ÍCONE DO TIME", d: "Identificação visual rápida do time, no canto superior esquerdo." },
                  { t: "EDIÇÃO E VERSÃO", d: "Controle claro de expansões e atualizações do baralho." },
                  { t: "ARTE CINEMATOGRÁFICA", d: "Cada personagem recebe uma atmosfera única e marcante." },
                ].map((f) => (
                  <div key={f.t} className="flex gap-4">
                    <div className="w-1 rounded-full bg-primary mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs tracking-[0.25em] text-primary font-semibold">{f.t}</div>
                      <div className="text-sm text-white/65 mt-1">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Back */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div className="text-[10px] tracking-[0.4em] text-primary mb-6 text-center">VERSO · JOGABILIDADE</div>
              <div className="max-w-[340px] aspect-[2/3] mx-auto relative">
                <CardBack />
              </div>
              <div className="mt-10 space-y-6 max-w-md mx-auto">
                {[
                  { t: "ATRIBUTOS RÁPIDOS", d: "Mecânica, período, uso, alvos, trabalho e grupo — em uma única tabela." },
                  { t: "DESCRIÇÃO ESSENCIAL", d: "O resumo da habilidade. Tudo que importa em segundos." },
                  { t: "QR CODE", d: "Acesso à descrição completa, pontuação detalhada e regras específicas." },
                ].map((f) => (
                  <div key={f.t} className="flex gap-4">
                    <div className="w-1 rounded-full bg-primary mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs tracking-[0.25em] text-primary font-semibold">{f.t}</div>
                      <div className="text-sm text-white/65 mt-1">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="funciona" className="relative py-32 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <SectionLabel>COMO FUNCIONA</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 text-balance">
              Escaneie. <span className="text-gold" style={{ color: "var(--gold)" }}>Descubra.</span> Jogue.
            </h2>
            <p className="mt-6 text-white/65 max-w-2xl mx-auto">
              Durante a partida o verso mostra apenas o essencial.
              Para detalhes completos, basta o celular.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {[
              { step: "01", title: "VERSO LIMPO", desc: "Informações essenciais para leitura rápida durante o jogo.", icon: ScrollText },
              { step: "02", title: "ESCANEIE O QR", desc: "Aponte qualquer celular para abrir a ficha completa do personagem.", icon: QrCode },
              { step: "03", title: "FICHA COMPLETA", desc: "Descrição, pontuação detalhada e regras específicas, sempre atualizadas.", icon: Sparkles },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="relative card-frame rounded-2xl p-8 noise"
              >
                <div className="font-display text-6xl text-primary/20 absolute top-4 right-6">{s.step}</div>
                <s.icon className="w-8 h-8 text-primary mb-6" strokeWidth={1.4} />
                <h3 className="font-display text-xl text-white tracking-wide">{s.title}</h3>
                <p className="text-sm text-white/60 mt-3 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Advantages */}
          <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {advantages.map((a, i) => (
              <motion.div
                key={a}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-5 rounded-xl border border-primary/15 bg-primary/[0.03]"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="text-sm text-white/80 leading-snug">{a}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ICONS */}
      <section id="icones" className="relative py-32 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <SectionLabel>LINGUAGEM VISUAL</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 text-balance">
              Ícones e significados
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {iconList.map((it, i) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4, borderColor: "oklch(0.65 0.18 245 / 50%)" }}
                className="group relative aspect-square card-frame rounded-xl flex flex-col items-center justify-center gap-3 noise"
              >
                <div className="w-12 h-12 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center transition group-hover:bg-primary/15 group-hover:shadow-glow">
                  <it.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <div className="text-[10px] tracking-[0.3em] text-white/70 font-semibold">{it.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VARIATIONS */}
      <section id="variacoes" className="relative py-32 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <SectionLabel>VARIAÇÕES POR TIME</SectionLabel>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-6 text-balance">
              Quatro times. <span style={{ color: "var(--gold)" }}>Infinitas histórias.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {variations.map((v, i) => (
              <MiniCard key={v.name} v={v} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* OBSERVATIONS */}
      <section className="relative py-32 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>OBSERVAÇÕES IMPORTANTES</SectionLabel>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {observations.map((o, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center mb-5">
                  <o.icon className="w-6 h-6 text-primary" strokeWidth={1.4} />
                </div>
                <p className="text-white/75 leading-relaxed max-w-xs mx-auto">{o.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs tracking-[0.25em] text-white/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-display text-white">SVR</span>
            <span>· SURVIVOR</span>
          </div>
          <div>ED. 003 · VER. 01 · APRESENTAÇÃO DO SISTEMA DE CARTAS</div>
        </div>
      </footer>
    </main>
  );
}
