import svgPaths from "./svg-xj45imo5t0";
import clsx from "clsx";
import imgImageAmooora from "../assets/2bcf17d7cfb76a60c14cf40243974d7d28fb3842.png";
import imgImageWithFallback from "../assets/80dd4699052040c81dfb3094ccf611489f68cfc1.png";
import imgImage from "../assets/43871cf309752c645e2e5606105f4be67c2b0aed.png";
import imgImageWithFallback1 from "../assets/362bf20826bb2c5a281a1e71abd2a36bcee5ab55.png";
import imgImageWithFallback2 from "../assets/028c3391b3f58c1823dea0349e832cc0cde33988.png";
import imgAWomanWithLongDarkHairSmilingWhileEnjoyingAPlateOfPastaInACozyRestaurant from "../assets/6dcb5100a271570770f5e3b0d128d012f826470d.png";
import imgAManWithDarkHairAndABeardSavoringAPlateOfPastaInAWarmAndInvitingItalianRestaurant from "../assets/cb79550d6bdeabde319ae7fd706c5fad6b806f29.png";
type ButtonBackgroundImageProps = {
  additionalClassNames?: string;
};

function ButtonBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ButtonBackgroundImageProps>) {
  return (
    <div className={clsx("h-[56px] relative rounded-[12px] shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-center px-0 py-[8px] relative size-full">{children}</div>
    </div>
  );
}

function ReviewWithUserDetailBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">{children}</div>
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[20px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">{children}</div>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[14px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        {children}
      </svg>
    </div>
  );
}

function BackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}

function ChipBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage>
      <g id="Chip">{children}</g>
    </BackgroundImage>
  );
}

function IconBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}
type Icon5VectorBackgroundImageProps = {
  additionalClassNames?: string;
};

function Icon5VectorBackgroundImage({ additionalClassNames = "" }: Icon5VectorBackgroundImageProps) {
  return (
    <div className={clsx("absolute bottom-3/4 top-[8.33%]", additionalClassNames)}>
      <div className="absolute inset-[-25%_-0.83px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 5">
          <path d="M0.833333 0.833333V4.16667" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </svg>
      </div>
    </div>
  );
}
type TextBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText({ text, additionalClassNames = "" }: TextBackgroundImageAndTextProps) {
  return (
    <div className={clsx("h-[16px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#717182] text-[12px] text-center text-nowrap">{text}</p>
      </div>
    </div>
  );
}

function RatingBackgroundImage() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-[86px]">
      {[...Array(4).keys()].map((_, i) => (
        <BackgroundImage1>
          <g id="Star Fill">
            <path d={svgPaths.p51d83b2} fill="var(--fill-0, #932D6F)" id="Icon" />
          </g>
        </BackgroundImage1>
      ))}
      <BackgroundImage1>
        <g id="Star">
          <path clipRule="evenodd" d={svgPaths.p2cf1c00} fill="var(--fill-0, #932D6F)" fillRule="evenodd" id="Icon" />
        </g>
      </BackgroundImage1>
    </div>
  );
}
type RowBackgroundImageAndTextProps = {
  text: string;
};

function RowBackgroundImageAndText({ text }: RowBackgroundImageAndTextProps) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="-webkit-box basis-0 font-['Inter:Bold',sans-serif] font-bold grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#281d1b] text-[17px] tracking-[-0.34px]">{text}</p>
    </div>
  );
}
type ChipSmallBackgroundImageAndTextProps = {
  text: string;
};

function ChipSmallBackgroundImageAndText({ text }: ChipSmallBackgroundImageAndTextProps) {
  return (
    <div className="bg-[#fffdfc] content-stretch flex gap-[4px] items-center justify-center min-h-[28px] px-[12px] py-[5px] relative rounded-[20px] shrink-0">
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(110,80,73,0.2)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#281d1b] text-[13px] text-nowrap">{text}</p>
      <BackgroundImage>
        <g clipPath="url(#clip0_109_280)" id="Chip">
          <path clipRule="evenodd" d={svgPaths.p38febd00} fill="var(--fill-0, #281D1B)" fillRule="evenodd" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_109_280">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </BackgroundImage>
    </div>
  );
}

export default function CriarUmaPaginaComUmaFotoEUmCampoDeDetalhamentoSobreORestauranteEsseCampoPrecisaSerEmTextoParaQueTenhamosUmTextoExplicativoEssaPaginaApareceraQuandoClicarmosEmUmBanner() {
  return (
    <div
      className="bg-white content-stretch flex flex-col isolate items-start relative size-full"
      data-name="Criar uma página com uma foto e um campo de detalhamento sobre o restaurante, esse campo precisa ser em texto para que tenhamos um texto explicativo.

essa página aparecerá quando clicarmos em um banner"
    >
      <div className="bg-[#fffbfa] content-stretch flex flex-col h-[104px] items-start overflow-clip relative shrink-0 w-full z-[2]" data-name="Header Navigation Bar With Title">
        <div className="bg-white h-[103px] relative shrink-0 w-full" data-name="Header">
          <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
          <div className="content-stretch flex flex-col items-start pb-px pt-[16px] px-[20px] relative size-full">
            <div className="content-stretch flex h-[70px] items-center justify-between relative shrink-0 w-full" data-name="Container">
              <div className="h-[70px] relative shrink-0 w-[177.016px]" data-name="Image (Amooora)">
                <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageAmooora} />
              </div>
              <div className="h-[40px] relative shrink-0 w-[88px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
                  <div className="bg-[#932d6f] relative rounded-[3.35544e+07px] shrink-0 size-[40px]" data-name="Button">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                      <IconBackgroundImage>
                        <path d={svgPaths.p3b7be120} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d={svgPaths.p1f3d9f80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      </IconBackgroundImage>
                    </div>
                  </div>
                  <div className="basis-0 bg-[#ff6b7a] grow h-[40px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Button">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                      <IconBackgroundImage>
                        <path d={svgPaths.pf237300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d={svgPaths.p2551a780} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        <path d={svgPaths.p18e3cd80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      </IconBackgroundImage>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[56px] overflow-clip relative shrink-0 w-full" data-name="Status Bar">
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[32px] not-italic text-[#281d1b] text-[17px] text-nowrap top-[17px]">12:45</p>
          <div className="absolute h-[14.5px] right-[32px] top-[20px] w-[78.5px]" data-name="Frame">
            <div className="absolute h-[11px] left-[55.5px] top-[3px] w-[23.5px]" data-name="Battery">
              <div className="absolute bg-[#281d1b] h-[11px] left-0 rounded-[14px] top-0 w-[22px]" data-name="Battery Fill" />
              <div className="absolute bg-[#281d1b] h-[5px] left-[13.5px] rounded-[14px] top-[3px] w-[10px]" data-name="Battery Fill" />
            </div>
            <div className="absolute bottom-[0.5px] h-[13px] left-[31.5px] w-[17px]" data-name="Wifi">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 13">
                <g id="Wifi">
                  <path d={svgPaths.p2f6e65e0} fill="var(--fill-0, #2E1814)" fillOpacity="0.4" id="Vector" />
                  <path d={svgPaths.p2e3dac80} fill="var(--fill-0, #281D1B)" id="Intersect" />
                </g>
              </svg>
            </div>
            <div className="absolute h-[14px] left-0 top-0 w-[23.5px]" data-name="Signal">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.5 14">
                <g id="Signal">
                  <path d={svgPaths.p30770000} fill="var(--fill-0, #281D1B)" id="Vector" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="basis-0 grow min-h-px min-w-px overflow-clip relative shrink-0 w-full" data-name="Navigation Bar">
          <p className="absolute font-['Roboto_Serif:Bold',sans-serif] font-bold leading-[normal] left-[196.5px] overflow-ellipsis overflow-hidden text-[#281d1b] text-[17px] text-center text-nowrap top-[13.5px] tracking-[-0.34px] translate-x-[-50%] w-[201px]" style={{ fontVariationSettings: "'GRAD' 0, 'wdth' 100" }}>
            Restaurante Detalhes
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col isolate items-start min-h-[668px] relative shrink-0 w-full z-[1]" data-name="Main Content">
        <div className="bg-white relative shrink-0 w-full z-[4]" data-name="Food Delivery Restaurant Page Header">
          <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none" />
          <div className="content-stretch flex flex-col gap-[12px] items-start pb-[16px] pt-0 px-[16px] relative w-full">
            <div className="bg-white content-stretch flex h-[200px] items-start relative shrink-0 w-full" data-name="Image Triple Grid">
              <div className="basis-0 content-stretch flex gap-[4px] grow h-full items-start min-h-px min-w-px relative rounded-[20px] shrink-0" data-name="Triple">
                <div className="basis-0 bg-repeat bg-size-[32px_32px] bg-top-left grow h-full min-h-px min-w-px overflow-clip relative rounded-[12px] shrink-0" data-name="Image" style={{ backgroundImage: `url('${imgImage}')` }}>
                  <div className="absolute h-[200px] left-0 top-0 w-[236px]" data-name="ImageWithFallback">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] h-full items-start justify-center relative shrink-0" data-name="Frame">
                  <div className="basis-0 bg-repeat bg-size-[32px_32px] bg-top-left grow min-h-px min-w-px overflow-clip relative rounded-[12px] shrink-0 w-[130px]" data-name="Image" style={{ backgroundImage: `url('${imgImage}')` }}>
                    <div className="absolute h-[98px] left-[-36px] top-0 w-[249px]" data-name="ImageWithFallback">
                      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback1} />
                    </div>
                  </div>
                  <div className="basis-0 bg-repeat bg-size-[32px_32px] bg-top-left grow min-h-px min-w-px overflow-clip relative rounded-[12px] shrink-0 w-[130px]" data-name="Image" style={{ backgroundImage: `url('${imgImage}')` }}>
                    <div className="absolute left-0 size-[130px] top-0" data-name="ImageWithFallback">
                      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback2} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Content">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex font-['DM_Sans:Bold',sans-serif] font-bold gap-[4px] items-center leading-[1.35] relative shrink-0 text-[#932d6f] text-[15px] text-nowrap" data-name="Frame">
                  <p className="relative shrink-0" style={{ fontVariationSettings: "'opsz' 14" }}>
                    $$
                  </p>
                  <p className="relative shrink-0" style={{ fontVariationSettings: "'opsz' 14" }}>
                    ·
                  </p>
                  <p className="relative shrink-0" style={{ fontVariationSettings: "'opsz' 14" }}>
                    Italian
                  </p>
                  <p className="relative shrink-0" style={{ fontVariationSettings: "'opsz' 14" }}>
                    ·
                  </p>
                  <p className="relative shrink-0" style={{ fontVariationSettings: "'opsz' 14" }}>
                    30-40 mins
                  </p>
                </div>
                <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
                  <div className="relative shrink-0 size-[24px]" data-name="Heart">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <g id="Heart">
                        <path clipRule="evenodd" d={svgPaths.p1a4c8880} fill="var(--fill-0, #932D6F)" fillRule="evenodd" id="Icon" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="font-['DM_Sans:Bold',sans-serif] font-bold leading-[normal] min-w-full relative shrink-0 text-[28px] text-black tracking-[-0.56px] w-[min-content]" style={{ fontVariationSettings: "'opsz' 14" }}>
                Café da Vila
              </p>
              <p className="-webkit-box font-['DM_Sans:Regular',sans-serif] font-normal h-[84px] leading-[1.35] overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-[rgba(0,0,0,0.5)] w-[361px]" style={{ fontVariationSettings: "'opsz' 14" }}>
                Bella Cucina é um restaurante italiano renomado, conhecido por suas autênticas massas e ambiente acolhedor.Bella Cucina é um restaurante italiano renomado, conhecido por suas autênticas massas e ambiente acolhedor.
              </p>
              <div className="content-stretch flex items-center pb-0 pt-[8px] px-0 relative shrink-0 w-full" data-name="Labels + Chevron">
                <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Labels">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Frame">
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Frame">
                      <BackgroundImage>
                        <g id="Star Fill">
                          <path d={svgPaths.p236a8000} fill="var(--fill-0, #932D6F)" id="Icon" />
                        </g>
                      </BackgroundImage>
                      <p className="font-['DM_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[17px] text-black text-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
                        4.5 (200)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#fffbfa] relative shrink-0 w-full z-[3]" data-name="Chip Carousel Small Icon Right">
          <div className="overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col items-start px-[18px] py-[8px] relative w-full">
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Chip Carousel Small">
                <div className="bg-[rgba(147,45,111,0.1)] content-stretch flex h-[28px] items-start min-h-[28px] px-[12px] py-[4px] relative rounded-[3.35544e+07px] shrink-0 w-[78px]" data-name="Chip Small 1">
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#932d6f] text-[13px] text-nowrap">Já fui</p>
                  <ChipBackgroundImage>
                    <path clipRule="evenodd" d={svgPaths.p382acf80} fill="var(--fill-0, #932D6F)" fillRule="evenodd" id="Icon" />
                  </ChipBackgroundImage>
                </div>
                <div className="bg-[rgba(147,45,111,0.1)] content-stretch flex h-[28px] items-start min-h-[28px] px-[12px] py-[4px] relative rounded-[3.35544e+07px] shrink-0 w-[126px]" data-name="Chip Small 2">
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#932d6f] text-[13px] text-nowrap">Compartilhar</p>
                  <BackgroundImage>
                    <g clipPath="url(#clip0_109_292)" id="Chip">
                      <g id="Icon">
                        <path d={svgPaths.p304e0000} fill="var(--fill-0, #932D6F)" />
                        <path d={svgPaths.p2d9de800} fill="var(--fill-0, #932D6F)" />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_109_292">
                        <rect fill="white" height="16" width="16" />
                      </clipPath>
                    </defs>
                  </BackgroundImage>
                </div>
                <div className="bg-[rgba(147,45,111,0.1)] content-stretch flex h-[28px] items-start min-h-[28px] px-[12px] py-[4px] relative rounded-[3.35544e+07px] shrink-0 w-[108px]" data-name="Chip Small 3">
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#932d6f] text-[13px] text-nowrap">Denunciar</p>
                  <ChipBackgroundImage>
                    <g id="Icon">
                      <path clipRule="evenodd" d={svgPaths.p2b426800} fill="var(--fill-0, #932D6F)" fillRule="evenodd" />
                      <path d={svgPaths.p3b9bbf00} fill="var(--fill-0, #932D6F)" />
                      <path d={svgPaths.p20c0a900} fill="var(--fill-0, #932D6F)" />
                      <path d={svgPaths.p2df7df00} fill="var(--fill-0, #932D6F)" />
                      <path d={svgPaths.p29675a30} fill="var(--fill-0, #932D6F)" />
                    </g>
                  </ChipBackgroundImage>
                </div>
                <div className="bg-[rgba(147,45,111,0.1)] content-stretch flex h-[28px] items-start min-h-[28px] px-[12px] py-[4px] relative rounded-[3.35544e+07px] shrink-0 w-[84px]" data-name="Chip Small 4">
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#932d6f] text-[13px] text-nowrap">Seguir</p>
                  <div className="relative shrink-0 size-[16px]" data-name="Chip">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
                      <div className="absolute inset-[4.17%_4.17%_0_4.17%]" data-name="Icon">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 15.3333">
                          <g id="Icon">
                            <path d={svgPaths.p13838700} fill="var(--fill-0, #932D6F)" />
                            <path d={svgPaths.p104cc300} fill="var(--fill-0, #932D6F)" />
                            <path d={svgPaths.p1bedd700} fill="var(--fill-0, #932D6F)" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <ChipSmallBackgroundImageAndText text="Chip" />
                <ChipSmallBackgroundImageAndText text="Chip" />
                <ChipSmallBackgroundImageAndText text="Chip" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-[393px] z-[2]" data-name="Restaurant Detail Page Reviews">
          <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Section title">
            <div className="relative shrink-0 w-full" data-name="Label + Link">
              <div className="flex flex-row items-end size-full">
                <div className="content-stretch flex items-end justify-between pb-[2px] pt-[28px] px-[18px] relative w-full">
                  <p className="basis-0 font-['Inter:Bold',sans-serif] font-bold grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#281d1b] text-[18px] tracking-[-0.36px]">Comentários</p>
                </div>
              </div>
            </div>
          </div>
          <ReviewWithUserDetailBackgroundImage>
            <div className="bg-white content-stretch flex gap-[18px] items-center relative shrink-0 w-full" data-name="Table Cell">
              <div className="relative rounded-[360px] shrink-0 size-[40px]" data-name="A woman with long dark hair smiling while enjoying a plate of pasta in a cozy restaurant.">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[360px] size-full" src={imgAWomanWithLongDarkHairSmilingWhileEnjoyingAPlateOfPastaInACozyRestaurant} />
              </div>
              <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Labels">
                <RowBackgroundImageAndText text="Ana Paula" />
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.35] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[12px] text-[rgba(46,24,20,0.62)] text-nowrap tracking-[-0.06px] w-full">Review posted 3 days ago.</p>
              </div>
            </div>
            <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Frame">
              <RatingBackgroundImage />
            </div>
            <p className="-webkit-box font-['Inter:Regular',sans-serif] font-normal leading-[1.35] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#281d1b] text-[15px] tracking-[-0.075px] w-full">The pasta was superb, and the atmosphere was just right.</p>
          </ReviewWithUserDetailBackgroundImage>
          <ReviewWithUserDetailBackgroundImage>
            <div className="bg-white content-stretch flex gap-[18px] items-center relative shrink-0 w-full" data-name="Table Cell">
              <div className="relative rounded-[360px] shrink-0 size-[40px]" data-name="A man with dark hair and a beard savoring a plate of pasta in a warm and inviting Italian restaurant.">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[360px] size-full" src={imgAManWithDarkHairAndABeardSavoringAPlateOfPastaInAWarmAndInvitingItalianRestaurant} />
              </div>
              <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Labels">
                <RowBackgroundImageAndText text="Joana Faria" />
                <p className="font-['Public_Sans:Regular',sans-serif] font-normal leading-[1.35] overflow-ellipsis overflow-hidden relative shrink-0 text-[12px] text-[rgba(46,24,20,0.62)] text-nowrap tracking-[-0.06px] w-full">Review posted 3 days ago.</p>
              </div>
            </div>
            <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Frame">
              <RatingBackgroundImage />
            </div>
            <p className="-webkit-box font-['Public_Sans:Regular',sans-serif] font-normal leading-[1.35] overflow-ellipsis overflow-hidden relative shrink-0 text-[#281d1b] text-[15px] tracking-[-0.075px] w-full">A delightful dining experience that takes you to Italy with every bite.</p>
          </ReviewWithUserDetailBackgroundImage>
          <div className="absolute bg-white bottom-0 h-px left-0 overflow-clip right-0" data-name="Divider">
            <div className="absolute bg-[rgba(110,80,73,0.2)] bottom-0 h-[0.5px] left-0 right-0" data-name="Rectangle" />
          </div>
        </div>
        <div className="bg-white content-stretch flex flex-col h-[73px] items-start pb-0 pt-px px-0 relative shrink-0 w-full z-[1]" data-name="BottomNav">
          <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
          <div className="h-[72px] relative shrink-0 w-full" data-name="Container">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex items-center justify-between pl-[15.016px] pr-[15.031px] py-0 relative size-full">
                <ButtonBackgroundImage additionalClassNames="w-[60px]">
                  <BackgroundImage2>
                    <div className="absolute bottom-[12.5%] left-[37.5%] right-[37.5%] top-1/2" data-name="Vector">
                      <div className="absolute inset-[-13.89%_-20.83%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.08333 9.58333">
                          <path d={svgPaths.p166d1e40} id="Vector" stroke="var(--stroke-0, #932D6F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08333" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-[8.34%_12.5%_12.5%_12.5%]" data-name="Vector">
                      <div className="absolute inset-[-6.58%_-6.94%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.0833 17.9162">
                          <path d={svgPaths.pccf3a00} id="Vector" stroke="var(--stroke-0, #932D6F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.08333" />
                        </svg>
                      </div>
                    </div>
                  </BackgroundImage2>
                  <div className="h-[16px] relative shrink-0 w-[34.594px]" data-name="Text">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#932d6f] text-[12px] text-center text-nowrap">Home</p>
                    </div>
                  </div>
                </ButtonBackgroundImage>
                <ButtonBackgroundImage additionalClassNames="w-[61.016px]">
                  <BackgroundImage2>
                    <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
                      <div className="absolute inset-[-5%_-6.25%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 18.3331">
                          <path d={svgPaths.p217d1800} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-[29.17%_37.5%_45.83%_37.5%]" data-name="Vector">
                      <div className="absolute inset-[-16.67%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 6.66667">
                          <path d={svgPaths.p2314a170} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                    </div>
                  </BackgroundImage2>
                  <TextBackgroundImageAndText text="Locais" additionalClassNames="w-[37.016px]" />
                </ButtonBackgroundImage>
                <ButtonBackgroundImage additionalClassNames="w-[73.922px]">
                  <BackgroundImage2>
                    <div className="absolute inset-[8.33%_33.33%_16.67%_33.33%]" data-name="Vector">
                      <div className="absolute inset-[-5.56%_-12.5%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 16.6667">
                          <path d={svgPaths.p108c8f70} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-[16.67%] left-[8.33%] right-[8.33%] top-1/4" data-name="Vector">
                      <div className="absolute inset-[-7.14%_-5%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 13.3333">
                          <path d={svgPaths.pac6c580} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                    </div>
                  </BackgroundImage2>
                  <TextBackgroundImageAndText text="Serviços" additionalClassNames="w-[49.922px]" />
                </ButtonBackgroundImage>
                <ButtonBackgroundImage additionalClassNames="w-[69.984px]">
                  <BackgroundImage2>
                    <Icon5VectorBackgroundImage additionalClassNames="left-[33.33%] right-[66.67%]" />
                    <Icon5VectorBackgroundImage additionalClassNames="left-[66.67%] right-[33.33%]" />
                    <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
                      <div className="absolute inset-[-5.56%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
                          <path d={svgPaths.pf3beb80} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-[41.67%_12.5%_58.33%_12.5%]" data-name="Vector">
                      <div className="absolute inset-[-0.83px_-5.56%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 1.66667">
                          <path d="M0.833333 0.833333H15.8333" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                    </div>
                  </BackgroundImage2>
                  <TextBackgroundImageAndText text="Eventos" additionalClassNames="w-[45.984px]" />
                </ButtonBackgroundImage>
                <ButtonBackgroundImage additionalClassNames="w-[96.844px]">
                  <BackgroundImage2>
                    <div className="absolute inset-[62.5%_33.33%_12.5%_8.33%]" data-name="Vector">
                      <div className="absolute inset-[-16.67%_-7.14%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 6.66667">
                          <path d={svgPaths.p6877e0} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-[12.5%_45.83%_54.17%_20.83%]" data-name="Vector">
                      <div className="absolute inset-[-12.5%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 8.33333">
                          <path d={svgPaths.p3ffa2780} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-[63.04%_8.33%_12.5%_79.17%]" data-name="Vector">
                      <div className="absolute inset-[-17.04%_-33.33%_-17.04%_-33.34%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.16687 6.55854">
                          <path d={svgPaths.p39df7200} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-[13.04%_20.8%_54.67%_66.67%]" data-name="Vector">
                      <div className="absolute inset-[-12.91%_-33.25%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.1734 8.1254">
                          <path d={svgPaths.p159fd500} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                        </svg>
                      </div>
                    </div>
                  </BackgroundImage2>
                  <TextBackgroundImageAndText text="Comunidade" additionalClassNames="w-[72.844px]" />
                </ButtonBackgroundImage>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}