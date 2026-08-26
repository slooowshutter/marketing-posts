"use client"

import Image from "next/image"
import {
    Children,
    cloneElement,
    createContext,
    isValidElement,
    useContext,
    type CSSProperties,
    type ReactElement,
    type ReactNode,
} from "react"

import { cn } from '@/lib/utils'
import type { CarouselCanvas, SlideContent, TemplateKey } from '@/lib/carousels/schema'
import { CanvasSliceContext, WideCanvasSlice } from '@/components/carousels/wide-canvas'

export const SLIDE_W = 1080
export const SLIDE_H = 1350

export const IG = {
    cream: 'hsl(var(--background))',
    ink: 'hsl(var(--foreground))',
    photo: 'hsl(from hsl(var(--lime)) h 100% 50%)',
    orange: 'hsl(var(--primary))',
    stone: 'hsl(var(--accent))',
    card: 'hsl(var(--card))',
}

const SERIF: CSSProperties = { fontFamily: 'var(--font-ig-serif), Georgia, serif' }
const HAND: CSSProperties = { fontFamily: 'var(--font-ig-hand), cursive' }
const EMPTY_CONTENT: SlideContent = { text: {}, images: {} }
const SlideContentContext = createContext<SlideContent>(EMPTY_CONTENT)

function normalizeCopy(value: string) {
    return value.replace(/\s+/g, ' ').trim()
}

function replaceCopy(node: ReactNode, replacements: Record<string, string>): ReactNode {
    if (typeof node === 'string') {
        const replacement = replacements[normalizeCopy(node)]
        if (replacement === undefined) return node

        const leadingWhitespace = node.match(/^\s*/)?.[0] ?? ''
        const trailingWhitespace = node.match(/\s*$/)?.[0] ?? ''
        return `${leadingWhitespace}${replacement}${trailingWhitespace}`
    }

    if (Array.isArray(node)) {
        return Children.map(node, (child) => replaceCopy(child, replacements))
    }

    if (!isValidElement<{ children?: ReactNode }>(node) || node.props.children === undefined) {
        return node
    }

    return cloneElement(
        node as ReactElement<{ children?: ReactNode }>,
        undefined,
        replaceCopy(node.props.children, replacements),
    )
}

function Serif({ children, className, color }: { children: ReactNode; className?: string; color?: string }) {
    return (
        <span className={cn('italic', className)} style={{ ...SERIF, color, fontWeight: 400 }}>
            {children}
        </span>
    )
}

function Hand({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
    return (
        <span className={cn('block text-[40px] leading-[1.05]', className)} style={{ ...HAND, ...style }}>
            {children}
        </span>
    )
}

function Arrow({ className, style }: { className?: string; style?: CSSProperties }) {
    return (
        <svg viewBox="0 0 120 90" fill="none" className={cn('h-[68px] w-[90px]', className)} style={style}>
            <path d="M10 8 C 26 62, 70 76, 106 52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            <path
                d="M94 42 L 108 51 L 97 64"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function Logo({ tone = 'ink', className }: { tone?: 'ink' | 'white'; className?: string }) {
    return (
        <div
            className={cn(
                'flex flex-col items-center leading-none',
                tone === 'white' ? 'text-[hsl(var(--card))]' : 'text-[hsl(var(--foreground))]',
                className,
            )}
        >
            <span className="text-[40px] font-extrabold tracking-[-0.05em]">blend</span>
        </div>
    )
}

function Pill({
    children,
    tone = 'light',
    className,
}: {
    children: ReactNode
    tone?: 'light' | 'dark' | 'outline'
    className?: string
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-[36px] py-[17px] font-mono text-[24px] font-semibold tracking-[0.08em]',
                tone === 'light' && 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-[0_8px_28px_hsl(var(--foreground)/0.16)]',
                tone === 'dark' && 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]',
                tone === 'outline' && 'border-[3px] border-[hsl(var(--foreground)/0.70)] text-[hsl(var(--foreground))]',
                className,
            )}
        >
            {children}
        </span>
    )
}

function Slot({
    label = 'IMAGE',
    align = 'center',
    className,
    style,
}: {
    label?: string
    align?: 'center' | 'top'
    className?: string
    style?: CSSProperties
}) {
    const { images } = useContext(SlideContentContext)
    const image = images[label]

    return (
        <div
            className={cn(
                'relative flex flex-col items-center gap-[12px] overflow-hidden text-center',
                align === 'top' ? 'justify-start pt-[190px]' : 'justify-center',
                className,
            )}
            style={{ backgroundColor: IG.photo, ...style }}
        >
            {image ? (
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    unoptimized
                    sizes="1080px"
                    className="object-cover"
                    style={{ objectPosition: image.position ?? 'center' }}
                />
            ) : (
                <>
                    <span className="px-[24px] text-[34px] font-extrabold leading-[1.1] tracking-[0.01em] text-[hsl(var(--photo))]">
                        REPLACE WITH IMAGE
                    </span>
                    <span className="px-[24px] font-mono text-[20px] font-semibold tracking-[0.18em] text-[hsl(var(--photo))]">
                        {label}
                    </span>
                </>
            )}
        </div>
    )
}

/**
 * Slot renders one cover-fit image and owns its own box. Templates that need
 * the same source twice (a blurred bed under a whole, uncropped frame) read
 * the record directly instead.
 */
function useSlideImage(label: string) {
    const { images } = useContext(SlideContentContext)
    return images[label]
}

function Canvas({
    bg = IG.cream,
    color = IG.ink,
    children,
    className,
}: {
    bg?: string
    color?: string
    children: ReactNode
    className?: string
}) {
    const { text } = useContext(SlideContentContext)
    const content = Object.keys(text).length === 0 ? children : replaceCopy(children, text)

    return (
        <div
            className={cn('relative flex flex-col overflow-hidden font-sans antialiased', className)}
            style={{ width: SLIDE_W, height: SLIDE_H, background: bg, color }}
        >
            {content}
        </div>
    )
}

/* ═══════════════════════════ slide templates ═══════════════════════════ */

function CoverPhoto() {
    return (
        <Canvas>
            <Slot label="COVER PHOTO · FULL BLEED" className="absolute inset-0" />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, hsl(var(--foreground)/0.18) 0%, hsl(var(--foreground)/0) 34%, hsl(var(--foreground)/0.42) 100%)' }}
            />
            <Logo tone="white" className="absolute left-0 right-0 top-[64px]" />
            <div className="absolute bottom-[110px] left-0 right-0 flex flex-col items-center gap-[44px] text-center text-[hsl(var(--card))]">
                <h1 className="text-[118px] font-extrabold leading-[0.98] tracking-[-0.045em]">
                    Stop prompting.
                    <br />
                    Start <Serif>directing.</Serif>
                </h1>
                <Pill>SEE THE SYSTEM →</Pill>
            </div>
        </Canvas>
    )
}

function CoverStatChip() {
    return (
        <Canvas>
            <Slot label="COVER PHOTO · FULL BLEED" className="absolute inset-0" />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, hsl(var(--foreground)/0.24) 0%, hsl(var(--foreground)/0.04) 36%, hsl(var(--foreground)/0.52) 100%)' }}
            />
            <Logo tone="white" className="absolute left-0 right-0 top-[64px]" />
            <span className="absolute left-[84px] top-[540px] rounded-full bg-[hsl(var(--card)/0.95)] px-[32px] py-[16px] font-mono text-[22px] font-semibold tracking-[0.12em] text-[hsl(var(--foreground))] shadow-[0_10px_30px_hsl(var(--foreground)/0.25)]">
                1,000+ CREATORS ON BLEND
            </span>
            <div className="absolute bottom-[110px] left-[84px] right-[84px] text-[hsl(var(--card))]">
                <h1 className="text-[112px] font-extrabold leading-[1.0] tracking-[-0.045em]">
                    Your content team, <Serif>automated.</Serif>
                </h1>
            </div>
        </Canvas>
    )
}

function CoverSerifStatement() {
    return (
        <Canvas>
            <Slot label="COVER PHOTO · FULL BLEED" align="top" className="absolute inset-0" />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, hsl(var(--foreground)/0.34) 0%, hsl(var(--foreground)/0.24) 50%, hsl(var(--foreground)/0.40) 100%)' }}
            />
            <Logo tone="white" className="absolute left-0 right-0 top-[64px]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-[44px] text-center text-[hsl(var(--card))]">
                <h1 className="leading-[0.95] tracking-[-0.045em]">
                    <span className="block text-[104px] font-extrabold">This is</span>
                    <Serif className="block text-[190px]">leverage.</Serif>
                </h1>
                <Pill className="px-[30px] py-[14px] text-[21px]">MEET BLEND →</Pill>
            </div>
        </Canvas>
    )
}

function CoverLowerThird() {
    return (
        <Canvas>
            <Slot label="COVER PHOTO · FULL BLEED" className="absolute inset-0" />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, hsl(var(--foreground)/0.30) 0%, hsl(var(--foreground)/0.06) 42%, hsl(var(--foreground)/0.60) 100%)' }}
            />
            <span className="absolute left-[76px] top-[60px] font-mono text-[21px] font-semibold tracking-[0.2em] text-[hsl(var(--card)/0.80)]">
                BLEND — WORKFLOWS
            </span>
            <span className="absolute right-[76px] top-[60px] font-mono text-[21px] font-semibold tracking-[0.2em] text-[hsl(var(--card)/0.80)]">
                VOL. 02
            </span>
            <div className="absolute bottom-[110px] left-[84px] right-[84px] text-[hsl(var(--card))]">
                <h1 className="text-[108px] font-extrabold leading-[1.0] tracking-[-0.045em]">
                    Make ads that
                    <br />
                    <Serif>look expensive.</Serif>
                </h1>
                <div className="mt-[36px] h-[10px] w-[230px] bg-[hsl(var(--primary))]" />
                <p className="mt-[28px] font-mono text-[22px] tracking-[0.18em] text-[hsl(var(--card)/0.70)]">THE SYSTEM INSIDE →</p>
            </div>
        </Canvas>
    )
}

function CoverAnnotated() {
    return (
        <Canvas>
            <Slot label="COVER PHOTO · FULL BLEED" className="absolute inset-0" />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, hsl(var(--foreground)/0.52) 0%, hsl(var(--foreground)/0.10) 48%, hsl(var(--foreground)/0.34) 100%)' }}
            />
            <Logo tone="white" className="absolute right-[76px] top-[56px] items-end" />
            <h1 className="absolute left-[84px] top-[150px] text-[110px] font-extrabold leading-[1.02] tracking-[-0.045em] text-[hsl(var(--card))]">
                One brief.
                <br />
                <Serif>Thirty assets.</Serif>
            </h1>
            <div className="absolute right-[90px] top-[600px] text-[hsl(var(--primary))]">
                <Hand style={{ transform: 'rotate(-5deg)' }}>
                    all made
                    <br />
                    in one run
                </Hand>
                <Arrow className="ml-[8px] mt-[6px] -scale-x-100 rotate-[12deg]" />
            </div>
            <Pill className="absolute bottom-[84px] left-[84px]">STEAL THE SYSTEM →</Pill>
        </Canvas>
    )
}

function CoverTypePop() {
    return (
        <Canvas>
            <Slot label="COVER PHOTO · FULL BLEED" className="absolute inset-0" />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, hsl(var(--foreground)/0.22) 0%, hsl(var(--foreground)/0.06) 38%, hsl(var(--foreground)/0.68) 100%)' }}
            />
            <div className="absolute bottom-[130px] left-[84px] right-[84px] text-[hsl(var(--card))]">
                <p className="font-mono text-[22px] font-semibold tracking-[0.22em] text-[hsl(var(--card)/0.70)]">
                    AI CREATIVE WORKFLOWS
                </p>
                <h1 className="mt-[30px] text-[118px] font-extrabold leading-[0.98] tracking-[-0.045em]">
                    We automate
                    <br />
                    <span className="text-[hsl(var(--primary))]">the boring</span>
                    <br />
                    half of art.
                </h1>
            </div>
            <span className="absolute bottom-[54px] left-0 right-0 text-center font-mono text-[21px] tracking-[0.18em] text-[hsl(var(--card)/0.55)]">
                BLEND.APP
            </span>
        </Canvas>
    )
}

function EditorialCollage() {
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <div className="flex flex-1 flex-col px-[84px] pb-[84px] pt-[64px]">
                <h1 className="text-[86px] font-extrabold leading-[1.02] tracking-[-0.04em]">
                    Turn any image into
                    <br />
                    <Serif>campaign assets</Serif>
                </h1>
                <p className="mt-[36px] w-[560px] text-[29px] leading-[1.5] text-[hsl(var(--foreground)/0.70)]">
                    Phone shots in, finished creative out. One workflow renders every format your launch needs, already
                    on brand.
                </p>
                <div className="mt-auto flex items-end gap-[36px]">
                    <Slot label="BEFORE · PHONE SHOT" className="h-[470px] w-[420px] rounded-[26px]" />
                    <Slot label="AFTER · AD CREATIVE" className="h-[590px] w-[420px] rounded-[26px]" />
                    <Pill tone="light" className="mb-[8px] ml-auto">
                        SWIPE
                    </Pill>
                </div>
            </div>
        </Canvas>
    )
}

function AnnotatedUi() {
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <div className="relative mx-auto mt-[120px] w-[700px]">
                <div className="rounded-[26px] bg-[hsl(var(--card))] p-[36px] shadow-[0_30px_80px_hsl(var(--foreground)/0.16)]">
                    <div className="flex items-center gap-[14px]">
                        <span className="h-[16px] w-[16px] rounded-full bg-[hsl(var(--accent))]" />
                        <span className="h-[16px] w-[16px] rounded-full bg-[hsl(var(--accent))]" />
                        <span className="font-mono text-[20px] tracking-[0.14em] text-[hsl(var(--foreground)/0.50)]">
                            BLEND · WORKFLOW
                        </span>
                    </div>
                    <div className="mt-[26px] rounded-[16px] bg-[hsl(var(--background))] p-[28px] font-mono text-[23px] leading-[1.5] text-[hsl(var(--foreground)/0.70)]">
                        a linen shirt, studio light,
                        <br />
                        five angles, same model
                    </div>
                    <div className="mt-[26px] flex items-center justify-between">
                        <span className="font-mono text-[21px] tracking-[0.1em] text-[hsl(var(--foreground)/0.45)]">4:5 · ×5 OUTPUTS</span>
                        <span className="rounded-[12px] bg-[hsl(var(--primary))] px-[30px] py-[13px] font-mono text-[22px] font-semibold text-[hsl(var(--card))]">
                            Run
                        </span>
                    </div>
                </div>
                <div className="absolute -left-[10px] -top-[104px] text-[hsl(var(--primary))]">
                    <Hand style={{ transform: 'rotate(-5deg)' }}>your product photo</Hand>
                    <Arrow className="ml-[60px] mt-[2px]" />
                </div>
                <div className="absolute -right-[36px] top-[130px] text-[hsl(var(--foreground)/0.80)]">
                    <Hand style={{ transform: 'rotate(3deg)' }}>
                        five formats,
                        <br />
                        one run
                    </Hand>
                </div>
                <div className="absolute -bottom-[92px] left-[30px] text-[hsl(var(--foreground)/0.70)]">
                    <Arrow className="mb-[2px] ml-[130px] -scale-y-100 rotate-[150deg]" />
                    <Hand style={{ transform: 'rotate(-3deg)' }}>on brand, every time</Hand>
                </div>
            </div>
            <div className="mt-auto px-[84px] pb-[76px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-[62px] font-extrabold tracking-[-0.035em]">
                        Ad variants on <Serif>autopilot</Serif>
                    </h2>
                    <span className="rounded-full bg-[hsl(var(--accent))] px-[26px] py-[13px] font-mono text-[21px] font-semibold tracking-[0.1em] text-[hsl(var(--foreground)/0.75)]">
                        CONTENT CREATION
                    </span>
                </div>
                <p className="mt-[26px] text-[27px] leading-[1.5] text-[hsl(var(--foreground)/0.70)]">
                    Blend takes one brief and renders every asset in your visual system — angles, crops, formats — without
                    you touching a prompt twice.
                </p>
                <p className="mt-[24px] text-[26px] leading-[1.5] text-[hsl(var(--foreground)/0.80)]">
                    <span className="font-mono font-bold tracking-[0.1em]">IMPACT: </span>
                    campaign assets that took a studio week now take one run.
                </p>
            </div>
        </Canvas>
    )
}

function NumberedGrid() {
    const cards = [
        ['01', 'Hook variants', 'Ten scroll-stopping openers from one product truth.'],
        ['02', 'Product shots', 'Studio-grade renders of your item in five scenes.'],
        ['03', 'UGC scripts', 'Talking points structured like native creator videos.'],
        ['04', 'Email sequence', 'A launch drip written in your brand voice.'],
        ['05', 'Ad angles', 'Objection-led variations ready for testing.'],
        ['06', 'Carousel copy', 'Slide-by-slide copy for the announcement post.'],
    ] as const
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <h1 className="mt-[56px] text-center text-[88px] font-extrabold leading-none tracking-[-0.04em]">
                Launch week, <Serif>planned</Serif>
            </h1>
            <div className="mt-[64px] grid grid-cols-3 gap-[22px] px-[76px]">
                {cards.map(([n, title, body]) => (
                    <div key={n} className="h-[354px] rounded-[20px] bg-[hsl(var(--card))] p-[30px] shadow-[0_10px_30px_hsl(var(--foreground)/0.07)]">
                        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[hsl(var(--foreground))] font-mono text-[22px] font-semibold text-[hsl(var(--background))]">
                            {n}
                        </span>
                        <p className="mt-[24px] text-[27px] font-bold tracking-[-0.02em]">{title}</p>
                        <p className="mt-[12px] text-[21px] leading-[1.45] text-[hsl(var(--foreground)/0.60)]">{body}</p>
                    </div>
                ))}
            </div>
            <div className="mt-auto flex items-center justify-between px-[76px] pb-[64px]">
                <div className="flex w-[430px] gap-[10px]">
                    <span className="h-[7px] flex-1 rounded-full bg-[hsl(var(--foreground))]" />
                    <span className="h-[7px] flex-1 rounded-full bg-[hsl(var(--foreground)/0.15)]" />
                    <span className="h-[7px] flex-1 rounded-full bg-[hsl(var(--foreground)/0.15)]" />
                </div>
                <Pill tone="light">SWIPE</Pill>
            </div>
        </Canvas>
    )
}

function MacroSerif() {
    return (
        <Canvas>
            <Slot label="MACRO PHOTO · FULL BLEED" className="absolute inset-0" />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, hsl(var(--foreground)/0.30) 0%, hsl(var(--foreground)/0.05) 40%, hsl(var(--foreground)/0.45) 100%)' }}
            />
            <Logo tone="white" className="absolute left-0 right-0 top-[64px]" />
            <div className="absolute bottom-[130px] left-[92px] right-[92px] text-[hsl(var(--card))]">
                <p className="text-[150px] leading-none tracking-[-0.02em]">
                    <Serif>Texture.</Serif>
                </p>
                <ul className="mt-[36px] space-y-[10px] text-[27px] leading-[1.5] text-[hsl(var(--card)/0.90)]">
                    <li>· Visible pores and film grain</li>
                    <li>· Natural shadow falloff</li>
                    <li>· No plastic skin, no waxy light</li>
                    <li>· Consistent across every shot</li>
                </ul>
            </div>
            <span className="absolute bottom-[54px] left-0 right-0 text-center font-mono text-[21px] tracking-[0.18em] text-[hsl(var(--card)/0.55)]">
                BLEND.APP
            </span>
        </Canvas>
    )
}

function Comparison() {
    return (
        <Canvas bg={IG.ink}>
            <div className="flex h-full flex-col gap-[6px]">
                <div className="relative flex-1">
                    <Slot label="RESULT A" className="absolute inset-0" />
                    <span className="absolute bottom-[36px] left-[56px] text-[36px] font-bold text-[hsl(var(--card))] drop-shadow-[0_4px_18px_hsl(var(--foreground)/0.6)]">
                        One-shot prompt
                    </span>
                </div>
                <div className="relative flex-1">
                    <Slot label="RESULT B" className="absolute inset-0" />
                    <span className="absolute bottom-[36px] left-[56px] text-[36px] font-bold text-[hsl(var(--card))] drop-shadow-[0_4px_18px_hsl(var(--foreground)/0.6)]">
                        Blend workflow
                    </span>
                </div>
            </div>
            <Logo tone="white" className="absolute right-[56px] top-[48px] items-end" />
            <div className="absolute right-[72px] top-[46%] text-[hsl(var(--card)/0.90)]">
                <Hand style={{ transform: 'rotate(-4deg)' }}>same brief</Hand>
                <Arrow className="ml-[24px] rotate-[64deg]" />
            </div>
        </Canvas>
    )
}

function Statement() {
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <div className="flex flex-1 items-center px-[92px]">
                <h1 className="text-[104px] font-extrabold leading-[1.04] tracking-[-0.045em]">
                    Consistent output is a <Serif color={IG.orange}>system,</Serif> not a lucky <Serif>prompt.</Serif>
                </h1>
            </div>
            <div className="pb-[120px] text-center">
                <Pill tone="outline">LET&apos;S GET STARTED →</Pill>
            </div>
        </Canvas>
    )
}

function ProblemCard() {
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <div className="mx-auto mt-[120px] w-[884px] rounded-[36px] bg-[hsl(var(--foreground))] px-[70px] py-[96px] text-center text-[hsl(var(--background))] shadow-[0_36px_90px_hsl(var(--foreground)/0.28)]">
                <p className="font-mono text-[23px] font-semibold tracking-[0.22em] text-[hsl(var(--primary))]">THE PROBLEM</p>
                <p className="mt-[30px] text-[70px] font-bold leading-[1.15] tracking-[-0.03em]">
                    <Serif>vague</Serif> input produces <Serif>poor</Serif> output
                </p>
            </div>
            <div className="relative mt-[54px] flex justify-end pr-[150px]">
                <div className="absolute right-[490px] top-[10px] text-[hsl(var(--foreground)/0.70)]">
                    <Hand style={{ transform: 'rotate(-6deg)' }}>every single time</Hand>
                    <Arrow className="ml-[70px] mt-[4px]" />
                </div>
                <Slot label="EXAMPLE" className="h-[330px] w-[330px] rounded-[24px]" />
            </div>
            <Pill tone="light" className="absolute bottom-[64px] right-[76px]">
                SWIPE
            </Pill>
        </Canvas>
    )
}

function UseDontUse() {
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <div className="flex-1 px-[84px] pt-[64px]">
                <Pill tone="dark" className="px-[28px] py-[13px] text-[21px]">
                    USE IT FOR
                </Pill>
                <h1 className="mt-[34px] w-[640px] text-[76px] font-extrabold leading-[1.04] tracking-[-0.04em]">
                    High accuracy for <Serif>products</Serif> and <Serif>faces</Serif>
                </h1>
                <p className="mt-[36px] w-[470px] text-[26px] leading-[1.55] text-[hsl(var(--foreground)/0.70)]">
                    Blend keeps models and products consistent across generations, even when scenes, outfits, and poses
                    change between shots.
                </p>
                <Slot label="PHOTO · DETAIL" className="mt-[52px] h-[240px] w-[330px] rounded-[22px]" />
            </div>
            <Slot label="PHOTO · MODEL" className="absolute right-[84px] top-[404px] h-[560px] w-[400px] rounded-[24px]" />
            <div className="absolute right-[300px] top-[1020px] text-[hsl(var(--primary))]">
                <Hand style={{ transform: 'rotate(-4deg)' }}>same face, every render</Hand>
            </div>
            <Pill tone="light" className="absolute bottom-[64px] right-[76px]">
                SWIPE
            </Pill>
        </Canvas>
    )
}

function Testimonial() {
    const bubbles = [
        ['Thank you so much! The workflow gallery alone was worth it — our whole feed runs on two of them now.', 'start'],
        ['I was skeptical about AI content until the outputs matched our brand guide on the first run.', 'end'],
        ['Set it up on Monday, shipped thirty assets by Friday. Genuinely absurd.', 'start'],
        ['Bought it for our team and it is amazing 🙌', 'end'],
    ] as const
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <h1 className="mx-auto mt-[44px] w-[820px] text-center text-[62px] font-extrabold leading-[1.12] tracking-[-0.035em]">
                Over <Serif color={IG.orange}>1,000 creators</Serif> already run their content on Blend.
            </h1>
            <div className="mx-auto mt-[54px] flex w-[780px] flex-col gap-[20px]">
                {bubbles.map(([text, side]) => (
                    <p
                        key={text}
                        className={cn(
                            'max-w-[560px] rounded-[24px] p-[26px] text-[24px] leading-[1.45] text-[hsl(var(--foreground)/0.80)] shadow-[0_8px_24px_hsl(var(--foreground)/0.06)]',
                            side === 'start' ? 'self-start bg-[hsl(var(--card))]' : 'self-end bg-[hsl(var(--accent))]',
                        )}
                    >
                        {text}
                    </p>
                ))}
            </div>
            <p className="mt-auto pb-[76px] text-center text-[30px] leading-[1.4] text-[hsl(var(--foreground)/0.85)]">
                Comment{' '}
                <span className="rounded-[10px] bg-[hsl(var(--foreground))] px-[18px] py-[6px] font-mono text-[26px] font-semibold text-[hsl(var(--background))]">
                    &ldquo;blend&rdquo;
                </span>{' '}
                and grab the guide.
            </p>
        </Canvas>
    )
}

function PhotoGrid6() {
    const labels = ['LINEN', 'DENIM', 'LEATHER', 'WOOL', 'SILK', 'CANVAS']
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <div className="mt-[64px] grid grid-cols-3 gap-[18px] px-[76px]">
                {labels.map((l) => (
                    <Slot key={l} label={l} className="h-[350px] rounded-[18px]" />
                ))}
            </div>
            <div className="relative mt-auto flex items-end justify-between px-[84px] pb-[84px]">
                <div>
                    <p className="w-[300px] text-[23px] leading-[1.5] text-[hsl(var(--foreground)/0.60)]">
                        Apply materials and finishes before ordering a single sample.
                    </p>
                    <h1 className="mt-[26px] text-[74px] font-extrabold leading-[1.05] tracking-[-0.04em]">
                        One product,
                        <br />
                        every <Serif>finish</Serif>
                    </h1>
                </div>
                <div className="mb-[160px] text-[hsl(var(--primary))]">
                    <Hand style={{ transform: 'rotate(-4deg)' }}>
                        same product,
                        <br />
                        six materials
                    </Hand>
                    <Arrow className="ml-[40px] -scale-y-100 rotate-[24deg]" />
                </div>
            </div>
        </Canvas>
    )
}

function BeforeAfter() {
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <h1 className="mt-[60px] px-[84px] text-[80px] font-extrabold leading-[1.04] tracking-[-0.04em]">
                From phone shot to
                <br />
                <Serif>campaign shot</Serif>
            </h1>
            <div className="mt-[70px] flex items-center justify-center gap-[36px] px-[84px]">
                <div>
                    <Slot label="YOUR PHOTO" className="h-[560px] w-[420px] rounded-[24px]" />
                    <p className="mt-[20px] text-center font-mono text-[21px] tracking-[0.16em] text-[hsl(var(--foreground)/0.50)]">
                        SHOT ON A PHONE
                    </p>
                </div>
                <Arrow className="h-[90px] w-[120px] shrink-0 -rotate-[24deg] text-[hsl(var(--primary))]" />
                <div>
                    <Slot label="BLEND OUTPUT" className="h-[560px] w-[420px] rounded-[24px]" />
                    <p className="mt-[20px] text-center font-mono text-[21px] tracking-[0.16em] text-[hsl(var(--foreground)/0.50)]">
                        RENDERED BY BLEND
                    </p>
                </div>
            </div>
            <Pill tone="light" className="absolute bottom-[64px] right-[76px]">
                SWIPE
            </Pill>
        </Canvas>
    )
}

function PromptAnnotated() {
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <div className="relative mx-auto mt-[150px] w-[760px]">
                <div className="rounded-[24px] bg-[hsl(var(--card))] p-[44px] shadow-[0_30px_80px_hsl(var(--foreground)/0.14)]">
                    <p className="font-mono text-[26px] leading-[1.55] text-[hsl(var(--foreground)/0.75)]">
                        Generate a hyperrealistic 4K image of a blonde woman wearing a gold ring.
                    </p>
                    <div className="mt-[30px] flex items-center justify-between">
                        <span className="font-mono text-[20px] tracking-[0.1em] text-[hsl(var(--foreground)/0.40)]">0:16 · DRAFT</span>
                        <span className="rounded-[12px] bg-[hsl(var(--foreground))] px-[28px] py-[12px] font-mono text-[21px] font-semibold text-[hsl(var(--background))]">
                            Generate
                        </span>
                    </div>
                </div>
                <div className="absolute -top-[86px] left-[10px] text-[hsl(var(--foreground)/0.75)]">
                    <Hand style={{ transform: 'rotate(-4deg)' }}>vague</Hand>
                </div>
                <div className="absolute -top-[92px] right-[40px] text-[hsl(var(--foreground)/0.75)]">
                    <Hand style={{ transform: 'rotate(3deg)' }}>unstructured</Hand>
                    <Arrow className="ml-[20px] rotate-[80deg]" />
                </div>
                <div className="absolute -bottom-[100px] left-[120px] text-[hsl(var(--primary))]">
                    <Arrow className="mb-[4px] ml-[110px] -scale-x-100 rotate-[110deg]" />
                    <Hand style={{ transform: 'rotate(-3deg)' }}>lacks context</Hand>
                </div>
            </div>
            <div className="mt-auto px-[84px] pb-[90px]">
                <h1 className="text-[82px] font-extrabold leading-[1.05] tracking-[-0.04em]">
                    You need to stop writing <Serif>prompts</Serif> like these
                </h1>
            </div>
            <Pill tone="light" className="absolute bottom-[64px] right-[76px]">
                THE THING IS →
            </Pill>
        </Canvas>
    )
}

function QuestionPhotos() {
    const shots = [
        ['SOCIALS', false],
        ['SHOP', true],
        ['ADS', false],
    ] as const
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <div className="mt-[110px] px-[100px] text-center">
                <h1 className="text-[88px] font-extrabold leading-[1.06] tracking-[-0.04em]">
                    What&apos;s the <Serif>purpose</Serif> of the shot?
                </h1>
                <p className="mx-auto mt-[34px] w-[600px] text-[26px] leading-[1.55] text-[hsl(var(--foreground)/0.65)]">
                    Feed, shop, campaigns, or ads? The right image depends on where it will live — so the workflow asks
                    first.
                </p>
            </div>
            <div className="mt-auto flex justify-center gap-[26px] pb-[110px]">
                {shots.map(([label]) => (
                    <div key={label} className="relative">
                        <Slot label="PHOTO" className="h-[400px] w-[292px] rounded-[20px]" />
                        <span className="absolute left-[16px] top-[16px] rounded-full bg-[hsl(var(--card)/0.90)] px-[18px] py-[8px] font-mono text-[18px] font-semibold tracking-[0.14em] text-[hsl(var(--foreground)/0.75)]">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </Canvas>
    )
}

function ShowcaseCard() {
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <div className="flex items-start justify-between px-[84px] pt-[64px]">
                <h1 className="w-[600px] text-[80px] font-extrabold leading-[1.04] tracking-[-0.04em]">
                    Generate consistent <Serif>shop images</Serif>
                </h1>
                <div className="mt-[16px] w-[260px] text-[hsl(var(--foreground)/0.70)]">
                    <Hand className="text-[34px]" style={{ transform: 'rotate(-3deg)' }}>
                        every product in one scene, no reshoots
                    </Hand>
                    <Arrow className="ml-[10px] rotate-[64deg]" />
                </div>
            </div>
            <p className="mt-[30px] px-[84px] text-[26px] leading-[1.5] text-[hsl(var(--foreground)/0.65)]">
                Add a product, rerun the workflow, and the whole catalog stays in the same world.
            </p>
            <div className="mt-auto px-[84px] pb-[100px]">
                <Slot label="SHOP SCREENSHOT / CATALOG" className="h-[600px] w-full rounded-[26px]" />
            </div>
            <Pill tone="light" className="absolute bottom-[64px] right-[76px]">
                SWIPE
            </Pill>
        </Canvas>
    )
}

function StepsTimeline() {
    const steps = [
        ['01', 'Drop the brief', 'One paragraph on what you sell and who it is for.'],
        ['02', 'Pick the workflow', 'Product shots, ad angles, or a full launch pack.'],
        ['03', 'Review the batch', 'Approve, remix, or rerun any output in place.'],
        ['04', 'Publish everywhere', 'Every format exports ready for each platform.'],
    ] as const
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <h1 className="px-[84px] pt-[60px] text-[80px] font-extrabold leading-[1.04] tracking-[-0.04em]">
                From brief to <Serif>published</Serif>
            </h1>
            <div className="mt-[64px] flex flex-col px-[84px]">
                {steps.map(([n, title, body], i) => (
                    <div key={n} className="relative flex gap-[36px] pb-[52px]">
                        {i < steps.length - 1 && (
                            <span className="absolute bottom-0 left-[35px] top-[76px] w-[3px] bg-[hsl(var(--accent))]" />
                        )}
                        <span className="z-10 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] font-mono text-[26px] font-bold text-[hsl(var(--card))]">
                            {n}
                        </span>
                        <div className="pt-[6px]">
                            <p className="text-[36px] font-bold tracking-[-0.02em]">{title}</p>
                            <p className="mt-[8px] w-[640px] text-[25px] leading-[1.45] text-[hsl(var(--foreground)/0.60)]">{body}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Pill tone="light" className="absolute bottom-[64px] right-[76px]">
                SWIPE
            </Pill>
        </Canvas>
    )
}

function Checklist() {
    const dos = ['Name the light source', 'Lock the camera angle', 'Reference one visual style']
    const donts = ['“Make it pop”', '“4K hyperrealistic”', '“Something premium”']
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <h1 className="mt-[64px] text-center text-[84px] font-extrabold leading-none tracking-[-0.04em]">
                Prompts that <Serif>work</Serif>
            </h1>
            <div className="mt-[70px] grid grid-cols-2 gap-[30px] px-[76px]">
                <div>
                    <p className="mb-[22px] font-mono text-[22px] font-semibold tracking-[0.18em] text-[hsl(var(--primary))]">
                        SAY THIS
                    </p>
                    <div className="flex flex-col gap-[20px]">
                        {dos.map((t) => (
                            <div key={t} className="flex items-center gap-[20px] rounded-[18px] bg-[hsl(var(--card))] p-[26px] shadow-[0_8px_24px_hsl(var(--foreground)/0.06)]">
                                <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[26px] font-bold text-[hsl(var(--card))]">
                                    ✓
                                </span>
                                <span className="text-[27px] font-semibold leading-[1.2]">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="mb-[22px] font-mono text-[22px] font-semibold tracking-[0.18em] text-[hsl(var(--foreground)/0.45)]">
                        NOT THIS
                    </p>
                    <div className="flex flex-col gap-[20px]">
                        {donts.map((t) => (
                            <div key={t} className="flex items-center gap-[20px] rounded-[18px] bg-[hsl(var(--accent)/0.60)] p-[26px]">
                                <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[hsl(var(--foreground)/0.15)] text-[24px] font-bold text-[hsl(var(--foreground)/0.50)]">
                                    ✕
                                </span>
                                <span className="text-[27px] font-medium leading-[1.2] text-[hsl(var(--foreground)/0.55)]">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <p className="mt-auto pb-[70px] text-center text-[26px] leading-[1.5] text-[hsl(var(--foreground)/0.65)]">
                Specific beats spectacular. Every single time.
            </p>
        </Canvas>
    )
}

function StatBig() {
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <div className="flex flex-1 flex-col items-center justify-center text-center">
                <p className="font-mono text-[24px] font-semibold tracking-[0.3em] text-[hsl(var(--foreground)/0.50)]">THE MATH</p>
                <p className="mt-[10px] text-[300px] font-extrabold leading-none tracking-[-0.06em]">
                    30<span className="text-[hsl(var(--primary))]">×</span>
                </p>
                <div className="mx-auto mt-[30px] h-[10px] w-[180px] bg-[hsl(var(--primary))]" />
                <p className="mx-auto mt-[40px] w-[680px] text-[40px] font-semibold leading-[1.3] tracking-[-0.02em]">
                    more content from the <Serif>same budget.</Serif>
                </p>
            </div>
            <p className="pb-[70px] text-center font-mono text-[21px] tracking-[0.18em] text-[hsl(var(--foreground)/0.45)]">
                ONE WORKFLOW · THIRTY ASSETS · ZERO RESHOOTS
            </p>
        </Canvas>
    )
}

function PhotoPairTilt() {
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <h1 className="mt-[54px] text-center text-[80px] font-extrabold leading-[1.04] tracking-[-0.04em]">
                Same model, <Serif>every scene</Serif>
            </h1>
            <div className="relative mx-auto mt-[90px] h-[600px] w-[820px]">
                <Slot label="SCENE A" className="absolute left-0 top-[30px] h-[520px] w-[430px] -rotate-3 rounded-[26px] shadow-[0_24px_60px_hsl(var(--foreground)/0.18)]" />
                <Slot label="SCENE B" className="absolute right-0 top-0 h-[520px] w-[430px] rotate-2 rounded-[26px] shadow-[0_24px_60px_hsl(var(--foreground)/0.18)]" />
                <div className="absolute -right-[20px] bottom-[10px] text-[hsl(var(--primary))]">
                    <Arrow className="mb-[4px] ml-[90px] -scale-x-100 rotate-[100deg]" />
                    <Hand style={{ transform: 'rotate(-4deg)' }}>same face, both shots</Hand>
                </div>
            </div>
            <p className="mt-auto pb-[76px] text-center text-[26px] leading-[1.5] text-[hsl(var(--foreground)/0.65)]">
                Blend keeps identity locked while everything else changes.
            </p>
        </Canvas>
    )
}

function ArrowFlow() {
    const stages = [
        ['YOUR PHOTO', 'BRIEF', false],
        ['THE WORKFLOW', 'BLEND', true],
        ['THE AD', 'OUTPUT', false],
    ] as const
    return (
        <Canvas>
            <Logo className="mt-[56px]" />
            <h1 className="px-[84px] pt-[64px] text-[80px] font-extrabold leading-[1.04] tracking-[-0.04em]">
                One run, start to <Serif>finish</Serif>
            </h1>
            <div className="mt-[90px] flex items-center justify-center gap-[18px] px-[60px]">
                {stages.map(([label, caption], i) => (
                    <div key={label} className="flex items-center gap-[18px]">
                        <div>
                            <Slot label={label} className="h-[380px] w-[280px] rounded-[22px]" />
                            <p className="mt-[16px] text-center font-mono text-[20px] tracking-[0.18em] text-[hsl(var(--foreground)/0.50)]">
                                {caption}
                            </p>
                        </div>
                        {i < stages.length - 1 && <Arrow className="mb-[40px] h-[60px] w-[80px] shrink-0 text-[hsl(var(--primary))]" />}
                    </div>
                ))}
            </div>
            <p className="mt-auto w-full px-[84px] pb-[84px] text-[26px] leading-[1.5] text-[hsl(var(--foreground)/0.65)]">
                No handoffs, no exports between tools. The photo goes in, the campaign comes out.
            </p>
            <Pill tone="light" className="absolute bottom-[64px] right-[76px]">
                SWIPE
            </Pill>
        </Canvas>
    )
}

/**
 * The 4:5 frame Marc asked for: show the WHOLE still, never a crop. The
 * letterbox bands above and below are the same still, cover-fit and blurred,
 * so a 4:3 result sits in a 4:5 slide without becoming a postage stamp.
 */
function CoverBlurFit() {
    const image = useSlideImage('COVER PHOTO · FULL BLEED')

    return (
        <Canvas bg={IG.ink}>
            {image ? (
                /* eslint-disable-next-line @next/next/no-img-element -- same
                   local asset as the sharp layer below, sized by the frame. */
                <img
                    src={image.src}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                        objectPosition: image.position ?? 'center',
                        filter: 'blur(64px) saturate(1.2)',
                        transform: 'scale(1.28)',
                    }}
                />
            ) : (
                <Slot label="COVER PHOTO · FULL BLEED" className="absolute inset-0" />
            )}
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, hsl(var(--foreground)/0.44) 0%, hsl(var(--foreground)/0.08) 28%, hsl(var(--foreground)/0.66) 100%)' }}
            />
            {image && (
                /* eslint-disable-next-line @next/next/no-img-element -- contain
                   fit inside a fixed frame; nothing for next/image to size. */
                <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute left-0 object-contain"
                    style={{ top: 180, width: SLIDE_W, height: 810 }}
                />
            )}
            <Logo tone="white" className="absolute left-0 right-0 top-[56px]" />
            <div className="absolute bottom-[92px] left-[76px] right-[76px] text-[hsl(var(--card))]">
                <p className="font-mono text-[22px] font-semibold tracking-[0.22em] text-[hsl(var(--card)/0.68)]">
                    RUBBER STAMP TRAVEL FIELD NOTES
                </p>
                <h1 className="mt-[22px] text-[86px] font-extrabold leading-[1.02] tracking-[-0.04em]">
                    One photo in.
                    <br />
                    <Serif>One poster out.</Serif>
                </h1>
            </div>
        </Canvas>
    )
}

/**
 * One workflow result per slide, full width, uncropped — the multi-result
 * pack. The dark ground and the designed bands are what stop a 4:3 result
 * from reading as a stamp dropped on cream.
 */
function ResultFull() {
    const image = useSlideImage('RESULT · FULL FRAME')

    return (
        <Canvas bg={IG.ink} color={IG.cream}>
            <p className="absolute left-[76px] top-[62px] font-mono text-[21px] font-semibold tracking-[0.22em] text-[hsl(var(--background)/0.55)]">
                FIELD NOTES · ONE RUN
            </p>
            <h2 className="absolute left-[76px] top-[126px] text-[84px] font-extrabold leading-[1.0] tracking-[-0.04em]">
                Arc de <Serif color={IG.orange}>Triomphe</Serif>
            </h2>
            {image ? (
                /* eslint-disable-next-line @next/next/no-img-element -- full
                   bleed at an exact size; contain keeps the stamp readable. */
                <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute left-0 object-contain"
                    style={{ top: 340, width: SLIDE_W, height: 810 }}
                />
            ) : (
                <Slot
                    label="RESULT · FULL FRAME"
                    className="absolute left-0"
                    style={{ top: 340, width: SLIDE_W, height: 810 }}
                />
            )}
            <div className="absolute left-[76px] top-[1178px] h-[6px] w-[132px] bg-[hsl(var(--primary))]" />
            <p className="absolute left-[76px] top-[1222px] w-[720px] text-[29px] leading-[1.35] text-[hsl(var(--background)/0.78)]">
                Same workflow, same stamp system, a different city.
            </p>
            <p className="absolute right-[76px] top-[1222px] font-mono text-[26px] font-semibold tracking-[0.14em] text-[hsl(var(--background)/0.50)]">
                01 / 05
            </p>
        </Canvas>
    )
}

function CtaPhoto() {
    return (
        <Canvas>
            <Slot label="CLOSER PHOTO · FULL BLEED" className="absolute inset-0" />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, hsl(var(--foreground)/0.30) 0%, hsl(var(--foreground)/0.30) 40%, hsl(var(--foreground)/0.78) 100%)' }}
            />
            <Logo tone="white" className="absolute left-0 right-0 top-[64px]" />
            <div className="absolute bottom-[150px] left-[80px] right-[80px] text-center text-[hsl(var(--card))]">
                <p className="text-[52px] font-semibold">
                    Comment{' '}
                    <span className="rounded-[14px] bg-[hsl(var(--primary))] px-[24px] py-[6px] font-bold text-[hsl(var(--foreground))]">
                        &ldquo;blend&rdquo;
                    </span>
                </p>
                <p className="mt-[34px] text-[68px] font-extrabold leading-[1.12] tracking-[-0.03em]">
                    and we&apos;ll DM you the workflow behind this post
                </p>
            </div>
            <p className="absolute bottom-[56px] left-0 right-0 text-center font-mono text-[21px] tracking-[0.16em] text-[hsl(var(--card)/0.60)]">
                P.S. FOLLOW @BLEND.APP · CHECK YOUR DM REQUESTS
            </p>
        </Canvas>
    )
}

function CtaStrategy() {
    return (
        <Canvas bg={IG.ink} color={IG.cream}>
            <Logo tone="white" className="mt-[64px]" />
            <p className="mx-auto mt-[80px] w-[840px] text-center text-[58px] font-bold leading-[1.25] tracking-[-0.02em]">
                We&apos;ve summarized our exact strategy for generating <Serif color={IG.orange}>consistent images</Serif>{' '}
                and videos for your brand, across <Serif color={IG.orange}>180+ pages.</Serif>
            </p>
            <div className="mt-[70px] flex justify-center gap-[24px]">
                <Slot label="GUIDE P.12" className="h-[330px] w-[250px] rounded-[18px]" />
                <Slot label="COVER" className="h-[330px] w-[250px] rounded-[18px]" />
                <Slot label="GUIDE P.87" className="h-[330px] w-[250px] rounded-[18px]" />
            </div>
            <p className="mt-auto pb-[90px] text-center text-[34px] leading-[1.4]">
                Comment{' '}
                <span className="rounded-[12px] bg-[hsl(var(--primary))] px-[20px] py-[6px] font-bold text-[hsl(var(--foreground))]">
                    &ldquo;blend&rdquo;
                </span>{' '}
                and grab your copy.
            </p>
        </Canvas>
    )
}

function CtaScribble() {
    return (
        <Canvas bg={IG.ink} color={IG.cream}>
            <Logo tone="white" className="mt-[64px]" />
            <div className="absolute right-[120px] top-[300px] text-[hsl(var(--primary))]">
                <Hand style={{ transform: 'rotate(4deg)' }}>
                    creative
                    <br />
                    workflow tools
                </Hand>
                <Arrow className="ml-[10px] rotate-[110deg]" />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-[38px] px-[110px] text-center">
                <p className="text-[56px] font-semibold">
                    Comment{' '}
                    <span className="rounded-[14px] bg-[hsl(var(--primary))] px-[24px] py-[8px] font-bold text-[hsl(var(--foreground))]">
                        &ldquo;blend&rdquo;
                    </span>
                </p>
                <p className="text-[62px] font-bold leading-[1.2] tracking-[-0.02em]">
                    to discover the hidden workflows top creators use to scale.
                </p>
            </div>
            <div className="pb-[70px] text-center text-[25px] leading-[1.6]">
                <p className="text-[hsl(var(--background)/0.85)]">
                    P.S. make sure to follow <span className="text-[hsl(var(--primary))]">@blend.app</span>
                </p>
                <p className="text-[hsl(var(--background)/0.55)]">and check your message requests.</p>
            </div>
        </Canvas>
    )
}

function CtaCream() {
    return (
        <Canvas>
            <Logo className="mt-[64px]" />
            <div className="flex flex-1 flex-col items-center justify-center gap-[40px] px-[100px] text-center">
                <p className="text-[64px] font-bold leading-[1.25] tracking-[-0.02em]">
                    Comment{' '}
                    <span className="rounded-[14px] bg-[hsl(var(--foreground))] px-[26px] py-[8px] font-mono text-[54px] font-semibold text-[hsl(var(--background))]">
                        &ldquo;blend&rdquo;
                    </span>{' '}
                    and we&apos;ll DM you this exact template.
                </p>
                <div className="text-[hsl(var(--primary))]">
                    <Hand style={{ transform: 'rotate(-4deg)' }}>free, forever</Hand>
                    <Arrow className="ml-[60px] -scale-y-100 rotate-[40deg]" />
                </div>
            </div>
            <div className="pb-[70px] text-center text-[25px] leading-[1.6] text-[hsl(var(--foreground)/0.60)]">
                <p>
                    P.S. don&apos;t forget to follow <span className="text-[hsl(var(--primary))]">@blend.app</span> for daily
                    workflows.
                </p>
            </div>
        </Canvas>
    )
}

function CtaEnd() {
    return (
        <Canvas bg={IG.ink} color={IG.cream}>
            <Logo tone="white" className="mt-[64px]" />
            <div className="flex flex-1 flex-col items-center justify-center gap-[44px] px-[80px] text-center">
                <p className="text-[58px] font-semibold">
                    Comment{' '}
                    <span className="rounded-[14px] bg-[hsl(var(--primary))] px-[26px] py-[8px] font-bold text-[hsl(var(--foreground))]">
                        &ldquo;blend&rdquo;
                    </span>
                </p>
                <h1 className="text-[84px] font-extrabold leading-[1.08] tracking-[-0.035em]">
                    and we&apos;ll send you the exact workflow behind this post
                </h1>
            </div>
            <div className="pb-[70px] text-center text-[25px] leading-[1.6]">
                <p className="text-[hsl(var(--background)/0.85)]">
                    P.S. don&apos;t forget to follow <span className="text-[hsl(var(--primary))]">@blend.app</span>
                </p>
                <p className="text-[hsl(var(--background)/0.55)]">and check your DM requests.</p>
            </div>
        </Canvas>
    )
}

export type SlideCategory = 'cover' | 'content' | 'cta'

export type SlideTemplate = {
    key: TemplateKey
    name: string
    note: string
    category: SlideCategory
    render: () => ReactNode
}

export const CATEGORIES: { key: SlideCategory; title: string; hint: string }[] = [
    { key: 'cover', title: '1 · Covers', hint: 'The hook. Always one full-bleed photo — only the text and elements layered on top change.' },
    { key: 'content', title: '2 · Content', hint: 'The middle of the carousel — what we teach. Eighteen ways to lay out a lesson.' },
    { key: 'cta', title: '3 · CTA closers', hint: 'Last slide. Comment-keyword closers in six flavors — dark, cream, and photo.' },
]

export const SLIDE_TEMPLATES: SlideTemplate[] = [
    { key: 'cover-photo', category: 'cover', name: 'Cover · centered stack', note: 'White sans + italic serif centered in the lower third, pill CTA.', render: () => <CoverPhoto /> },
    { key: 'cover-serif-statement', category: 'cover', name: 'Cover · serif statement', note: 'Centered mid-slide: one bold sans line over a giant italic serif word.', render: () => <CoverSerifStatement /> },
    { key: 'cover-annotated', category: 'cover', name: 'Cover · annotated', note: 'Top-left headline, orange scribble + arrow pointing into the photo.', render: () => <CoverAnnotated /> },
    { key: 'cover-type-pop', category: 'cover', name: 'Cover · type pop', note: 'Bottom-left type stack over a dark scrim, one line popped in solid orange.', render: () => <CoverTypePop /> },
    { key: 'cover-stat-chip', category: 'cover', name: 'Cover · stat chip', note: 'Floating white proof chip mid-photo, headline along the bottom.', render: () => <CoverStatChip /> },
    { key: 'cover-lower-third', category: 'cover', name: 'Cover · lower third', note: 'Mono meta in the top corners, headline + orange rule bottom-left.', render: () => <CoverLowerThird /> },
    { key: 'cover-blur-fit', category: 'cover', name: 'Cover · blurred letterbox', note: 'Whole photo, never cropped — the 4:5 bands are the same shot, blurred.', render: () => <CoverBlurFit /> },

    { key: 'editorial-collage', category: 'content', name: 'Editorial + photos', note: 'Big headline top-left, offset photo pair below.', render: () => <EditorialCollage /> },
    { key: 'annotated-ui', category: 'content', name: 'Annotated UI', note: 'Floating product card with handwritten notes and arrows.', render: () => <AnnotatedUi /> },
    { key: 'prompt-annotated', category: 'content', name: 'Annotated prompt', note: 'A bad prompt on a card, scribbled critiques around it.', render: () => <PromptAnnotated /> },
    { key: 'numbered-grid', category: 'content', name: 'Numbered card grid', note: 'List-style value slide with progress bar. No photo needed.', render: () => <NumberedGrid /> },
    { key: 'photo-grid-6', category: 'content', name: 'Photo grid 2×3', note: 'Variant matrix — same subject, six treatments, one scribble.', render: () => <PhotoGrid6 /> },
    { key: 'before-after', category: 'content', name: 'Before / after', note: 'Two photos side by side, orange arrow, mono captions.', render: () => <BeforeAfter /> },
    { key: 'comparison', category: 'content', name: 'Comparison stack', note: 'Two results stacked, labeled, one scribble tying them.', render: () => <Comparison /> },
    { key: 'macro-serif', category: 'content', name: 'Macro + serif word', note: 'Full-bleed close-up, giant italic serif label, bullets.', render: () => <MacroSerif /> },
    { key: 'question-photos', category: 'content', name: 'Question + strip', note: 'Centered question headline, three labeled shots below.', render: () => <QuestionPhotos /> },
    { key: 'showcase-card', category: 'content', name: 'Showcase card', note: 'Headline + hand note up top, one big screenshot below.', render: () => <ShowcaseCard /> },
    { key: 'statement', category: 'content', name: 'Statement', note: 'Text-only manifesto slide, serif accents carry the emphasis.', render: () => <Statement /> },
    { key: 'problem-card', category: 'content', name: 'Problem card', note: 'Dark rounded card on cream with scribble to an example.', render: () => <ProblemCard /> },
    { key: 'use-dont-use', category: 'content', name: 'Use it for', note: 'Tag pill + headline left, photo column right.', render: () => <UseDontUse /> },
    { key: 'steps-timeline', category: 'content', name: 'Steps timeline', note: 'Vertical numbered steps with a connector line. No photo needed.', render: () => <StepsTimeline /> },
    { key: 'checklist', category: 'content', name: 'Checklist', note: 'Say this / not this columns with check and cross chips.', render: () => <Checklist /> },
    { key: 'stat-big', category: 'content', name: 'Big stat', note: 'One giant number, orange accent, a single supporting line.', render: () => <StatBig /> },
    { key: 'photo-pair-tilt', category: 'content', name: 'Tilted photo pair', note: 'Two overlapping rotated photos with a handwritten tie.', render: () => <PhotoPairTilt /> },
    { key: 'arrow-flow', category: 'content', name: 'Arrow flow', note: 'Three stages connected by orange arrows, mono captions.', render: () => <ArrowFlow /> },
    { key: 'result-full', category: 'content', name: 'Result · full frame', note: 'One uncropped 4:3 result per slide on ink, with a title and a note band.', render: () => <ResultFull /> },
    { key: 'canvas-slice', category: 'content', name: 'Canvas slice', note: 'A 1080-wide window onto the version’s wide artboard. Author it in JSON.', render: () => <WideCanvasSlice /> },

    { key: 'cta-end', category: 'cta', name: 'CTA · dark classic', note: 'Comment chip + big promise + P.S. footer.', render: () => <CtaEnd /> },
    { key: 'cta-strategy', category: 'cta', name: 'CTA · strategy', note: 'Dark pre-close: highlighted promise + three guide thumbs.', render: () => <CtaStrategy /> },
    { key: 'cta-scribble', category: 'cta', name: 'CTA · scribbled', note: 'Dark closer with a handwritten aside pointing at the offer.', render: () => <CtaScribble /> },
    { key: 'cta-testimonial', category: 'cta', name: 'CTA · testimonial', note: 'Chat-bubble proof stacked above the comment keyword.', render: () => <Testimonial /> },
    { key: 'cta-cream', category: 'cta', name: 'CTA · cream', note: 'Light closer — chip inline in the sentence, scribble under.', render: () => <CtaCream /> },
    { key: 'cta-photo', category: 'cta', name: 'CTA · photo', note: 'Full-bleed photo closer, comment chip and promise on the scrim.', render: () => <CtaPhoto /> },
]

export const SAMPLE_CAROUSEL = [
    'cover-photo',
    'annotated-ui',
    'numbered-grid',
    'before-after',
    'cta-testimonial',
    'cta-end',
] as const

export const SAMPLE_GRID = [
    'cover-photo',
    'cover-type-pop',
    'cover-annotated',
    'cover-serif-statement',
    'cover-stat-chip',
    'cover-lower-third',
    'cover-photo',
    'cover-serif-statement',
    'cover-type-pop',
] as const

const TEMPLATES_BY_KEY = new Map(SLIDE_TEMPLATES.map((template) => [template.key, template]))

export function getSlideTemplate(key: TemplateKey) {
    return TEMPLATES_BY_KEY.get(key)
}

export function SlideRenderer({
    template,
    content = EMPTY_CONTENT,
    canvas = null,
    slice = 0,
}: {
    template: TemplateKey
    content?: SlideContent
    /** The version's wide artboard, for `canvas-slice` slides. */
    canvas?: CarouselCanvas | null
    /** Which 1080px column of that artboard this slide shows. */
    slice?: number
}) {
    const definition = getSlideTemplate(template)

    if (!definition) return null

    return (
        <SlideContentContext.Provider value={content}>
            <CanvasSliceContext.Provider value={{ canvas, slice }}>
                <div data-ig-palette="p6" data-slide-template={template}>
                    {definition.render()}
                </div>
            </CanvasSliceContext.Provider>
        </SlideContentContext.Provider>
    )
}
