// Cambia este enlace por el de tu Google Sheet CSV publicado
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1AbCDeFgHIJKlmNOPQrstuvWxyz1234567890/export?format=csv";

// Función para convertir CSV a JSON
function csvToJson(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        let obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = values[i] ? values[i].trim() : '';
        });
        return obj;
    });
}

document.getElementById('trackingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const guide = document.getElementById('guideNumber').value.trim();
    document.getElementById('result').innerHTML = '<div class="text-center"><div class="spinner-border"></div> Buscando...</div>';

    fetch(SHEET_CSV_URL)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo acceder a los datos');
            return response.text();
        })
        .then(csv => {
            const data = csvToJson(csv);
            // Asume que la columna de guía se llama 'Guía'
            const envio = data.find(row => row['Guía'] === guide);
            if (envio) {
                document.getElementById('result').innerHTML = `
                  <div class="col-md-8">
                    <div class="card shadow border-success">
                      <div class="card-header bg-success text-white">
                        <h5>Información del envío</h5>
                      </div>
                      <div class="card-body">
                        <p><strong>Guía:</strong> ${envio['Guía']}</p>
                        <p><strong>Cliente:</strong> ${envio['Cliente']}</p>
                        <p><strong>Origen:</strong> ${envio['Origen']}</p>
                        <p><strong>Destino:</strong> ${envio['Destino']}</p>
                        <p><strong>Estado:</strong> <span class="badge bg-info">${envio['Estado']}</span></p>
                        <p><strong>Fecha Estimada de Entrega:</strong> ${envio['Fecha Entrega']}</p>
                        <p><strong>Detalles:</strong> ${envio['Detalles'] || 'Sin detalles adicionales'}</p>
                      </div>
                    </div>
                  </div>`;
            } else {
                document.getElementById('result').innerHTML = `
                  <div class="col-md-6">
                    <div class="alert alert-danger text-center">
                      No se encontró información para la guía ingresada.
                    </div>
                  </div>`;
            }
        })
        .catch(error => {
            document.getElementById('result').innerHTML = `
              <div class="col-md-6">
                <div class="alert alert-warning text-center">
                  Error al consultar los datos. Intente nuevamente más tarde.
                </div>
              </div>`;
        });
});
