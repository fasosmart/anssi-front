"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// Cette page redirige vers la page accréditation standard
// car l'API /api/administrations/accreditations/{slug}/ ne nécessite pas entity_slug
export default function AccreditationDetailRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const accSlug = params.acc_slug as string;

  useEffect(() => {
    if (accSlug) {
      router.replace(`/dashboard/admin/accreditations/${accSlug}`);
    }
  }, [accSlug, router]);

  return null;
}


