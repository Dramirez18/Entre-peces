-- ============================================================
-- Migration 017: Admin puede leer todos los Client / Order / OrderItem
-- ============================================================
-- Problema: con RLS activo, las politicas de SELECT en Client y Order
-- solo exponen la fila propia del usuario autenticado (match por email).
-- El Admin Panel hace select('*') y por eso solo ve su propia fila:
-- los demas clientes y pedidos quedan ocultos (no es perdida de datos).
--
-- Solucion: funcion is_admin() SECURITY DEFINER (evita recursion RLS al
-- consultar Client dentro de una politica sobre Client) + politicas de
-- SELECT que la usan. Idempotente: se puede reejecutar sin romper nada.
--
-- Ejecutar en el SQL Editor de Supabase (proyecto blqvfrqkzaudrdbxjovt).
-- ============================================================

-- 1) Helper: ¿el usuario de la sesion es admin?
--    SECURITY DEFINER + search_path fijo. STABLE porque depende de auth.jwt().
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM "Client"
    WHERE lower("email") = lower(auth.jwt() ->> 'email')
      AND "role" = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2) Politicas de SELECT para admin (permisivas: se suman a las existentes)
DROP POLICY IF EXISTS "admin_select_all_clients" ON "Client";
CREATE POLICY "admin_select_all_clients" ON "Client"
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_select_all_orders" ON "Order";
CREATE POLICY "admin_select_all_orders" ON "Order"
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin_select_all_orderitems" ON "OrderItem";
CREATE POLICY "admin_select_all_orderitems" ON "OrderItem"
  FOR SELECT TO authenticated
  USING (public.is_admin());
