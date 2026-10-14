'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '../../../data/products';

export default function ProductRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  useEffect(() => {
    if (id) {
      const prod = getProductById(id);
      if (prod && prod.categoryId) {
        router.replace(`/products/${prod.categoryId}/${prod.id}`);
      } else {
        router.replace('/products');
      }
    }
  }, [id, router]);

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
      Loading product details...
    </div>
  );
}
