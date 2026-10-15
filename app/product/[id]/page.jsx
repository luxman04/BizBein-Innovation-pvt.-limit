'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '../../../data/products';
import { useStore } from '../../../context/StoreContext';

export default function ProductRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { getProductById: getStoreProductById } = useStore();

  useEffect(() => {
    if (!id) return;

    const prod = (getStoreProductById && getStoreProductById(id)) || getProductById(id);
    if (prod && prod.categoryId) {
      router.replace(`/products/${prod.categoryId}/${prod.id}`);
      return;
    }

    // Fallback: check dynamic product API
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.product && data.product.categoryId) {
          router.replace(`/products/${data.product.categoryId}/${data.product.id}`);
        } else {
          router.replace('/products');
        }
      })
      .catch(() => {
        router.replace('/products');
      });
  }, [id, router, getStoreProductById]);

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
      Loading product details...
    </div>
  );
}
