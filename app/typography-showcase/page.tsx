import {
  TypographyH1,
  TypographyH2,
  TypographyP,
} from "@/components/ui/typography";

export default function TypographyShowcase() {
  return (
    <div className="container mx-auto py-10">
      <TypographyH1>Typography Showcase</TypographyH1>
      
      <TypographyH2 className="mt-8">Heading 2</TypographyH2>
      
      <TypographyP className="mt-6">
        This is a regular paragraph without dot separators.
      </TypographyP>
      
      <TypographyH2 className="mt-8">Paragraphs with Dot Separators</TypographyH2>
      
      <div className="mt-6 space-y-2">
        <div>This is the first paragraph with a dot separator.</div>
        <div>This is the second paragraph with a dot separator.</div>
        <div>This is the third paragraph with a dot separator.</div>
      </div>
    </div>
  );
}