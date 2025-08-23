export default function Unauthorized() {
  return (
    <div className="container text-center my-5">
      <h1 className="display-4 text-danger">403 - Accès refusé</h1>
      <p className="lead">Vous n'avez pas la permission d'accéder à cette page.</p>
    </div>
  );
}
