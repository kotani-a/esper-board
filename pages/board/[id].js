import { useRouter } from 'next/router'
import Board from 'components/board'
import React, { useState, useEffect } from 'react';

export default function BoardPage() {
  const router = useRouter();
  const [esperId, setEsperId] = useState(router.query.id);

  useEffect(() => {
    setEsperId(router.query.id)
  },[router.query.id]);

  return (
    <>
      <Board esperId={esperId} />
    </>
  )
}
