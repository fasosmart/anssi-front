export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 px-6 md:px-10 border-t">
      <p className="text-center text-sm text-gray-500">
        &copy; {currentYear} ANSSI Guinée. Tous droits réservés.
      </p>
    </footer>
  );
}