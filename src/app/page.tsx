"use client";

import React from "react";
import AppLayout from "@/components/AppLayout";
import { styles } from "./styles";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <AppLayout>
      <div className={styles.container}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heading}>Welcome to Our Marketplace</h1>
            <p className={styles.subheading}>
              Discover amazing products from sellers around the world
            </p>
            <Link href="/products">
              <Button variant="primary" className={styles.button.large}>
                Explore Products
              </Button>
            </Link>
          </div>
          <div className={styles.heroImageContainer}>
            <img
              src="https://placehold.co/600x400/e2e8f0/1e293b?text=Marketplace"
              alt="Marketplace Hero"
              className={styles.heroImage}
            />
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionHeading}>Featured Products</h2>
          <p className={styles.text}>
            Discover our handpicked selection of top products from trusted
            sellers.
          </p>

          <div className={styles.featuredSection}>
            <div className={styles.featureItem}>
              <img
                src="https://placehold.co/300x200/e2e8f0/1e293b?text=New+Arrivals"
                alt="New Arrivals"
                className={styles.featureImage}
              />
              <h3>New Arrivals</h3>
              <p>Check out the latest products added to our marketplace.</p>
            </div>

            <div className={styles.featureItem}>
              <img
                src="https://placehold.co/300x200/e2e8f0/1e293b?text=Best+Sellers"
                alt="Best Sellers"
                className={styles.featureImage}
              />
              <h3>Best Sellers</h3>
              <p>See what other customers are loving right now.</p>
            </div>

            <div className={styles.featureItem}>
              <img
                src="https://placehold.co/300x200/e2e8f0/1e293b?text=Special+Offers"
                alt="Special Offers"
                className={styles.featureImage}
              />
              <h3>Special Offers</h3>
              <p>Limited time deals you don't want to miss.</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionHeading}>How It Works</h2>
          <p className={styles.text}>
            Our marketplace connects buyers with sellers in a seamless
            experience.
          </p>

          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <img
                src="https://placehold.co/200x150/e2e8f0/1e293b?text=Browse"
                alt="Browse"
                className={styles.stepImage}
              />
              <h3>Browse Products</h3>
              <p>Explore thousands of products across multiple categories</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <img
                src="https://placehold.co/200x150/e2e8f0/1e293b?text=Connect"
                alt="Connect"
                className={styles.stepImage}
              />
              <h3>Connect with Sellers</h3>
              <p>Message sellers directly to ask questions or negotiate</p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <img
                src="https://placehold.co/200x150/e2e8f0/1e293b?text=Purchase"
                alt="Purchase"
                className={styles.stepImage}
              />
              <h3>Secure Purchase</h3>
              <p>Buy with confidence using our secure payment system</p>
            </div>
          </div>
        </div>

        <div className={styles.testimonialSection}>
          <h2 className={styles.sectionHeading}>What Our Users Say</h2>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p className={styles.quote}>
                "This marketplace has transformed how I shop online. The variety
                of products is amazing!"
              </p>
              <div className={styles.author}>- Sarah J.</div>
            </div>
            <div className={styles.testimonial}>
              <p className={styles.quote}>
                "As a seller, I've been able to reach customers I never would
                have found otherwise."
              </p>
              <div className={styles.author}>- Michael T.</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
