'use client';

import Image from 'next/image';
import { useContentfulInspectorMode } from '@contentful/live-preview/react';

export default function Hero({ hero, isPreview }) {
  const inspector = useContentfulInspectorMode({
    entryId: hero?.sys?.id,
  });

  if (!hero?.fields) return null;

  const {
    heroBannerHeadline,
    heroBannerHeadlineColor,
    heroHeadlineText,
    heroBannerImage,
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
  } = hero.fields;

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Background Image */}
      {heroBannerImage?.fields?.file?.url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={`https:${heroBannerImage.fields.file.url}`}
            alt="Hero Banner"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        {/* heroBannerHeadline */}
        <h1
          {...(isPreview && inspector({ fieldId: 'heroBannerHeadline' }))}
          className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent"
          style={
            heroBannerHeadlineColor
              ? {
                  background: heroBannerHeadlineColor,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }
              : {
                  background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }
          }
        >
          {heroBannerHeadline}
        </h1>

        {/* Subheadline */}
        {heroHeadlineText && (
          <p
            {...(isPreview && inspector({ fieldId: 'heroHeadlineText' }))}
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
          >
            {heroHeadlineText}
          </p>
        )}

        {/* Buttons */}
        {(primaryButtonText || secondaryButtonText) && (
          <div className="flex flex-wrap justify-center gap-4">
            {primaryButtonText && primaryButtonLink && (
              <a
                href={primaryButtonLink}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg">
                {primaryButtonText}
              </a>
            )}
            {secondaryButtonText && secondaryButtonLink && (
              <a
                href={secondaryButtonLink}
                className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              >
                {secondaryButtonText}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}