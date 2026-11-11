// useFetch ejecuta una petición al montar la pantalla y devuelve { data, error }.

import { useState, useEffect } from "react";

export function useFetch(peticion) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    peticion()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return { data, error };
}
