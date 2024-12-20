export const getAll = async (req, res) => {
  let targetDate;

  // Función auxiliar para formatear fechas
  const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
  };

  // Función auxiliar para obtener el primer y último día del mes anterior
  const getPreviousMonthDates = (date) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
      return { firstDay, lastDay };
  };

  // Determinar la fecha objetivo basada en los parámetros
  if (req.params.month) {
      const year = new Date().getFullYear();
      targetDate = new Date(year, parseInt(req.params.month) - 1, 1);
  } else if (req.query.month) {
      const year = new Date().getFullYear();
      targetDate = new Date(year, parseInt(req.query.month) - 1, 1);
  } else if (req.query.date) {
      targetDate = new Date(req.query.date);
  } else {
      targetDate = new Date();
  }

  // Calcular el primer y último día del mes anterior
  const { firstDay, lastDay } = getPreviousMonthDates(targetDate);

  // Formatear las fechas
  const formattedFirstDay = formatDate(firstDay);
  const formattedLastDay = formatDate(lastDay);

  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        "parametros": {
            "aplicacion": "Lesag", 
            "login": "lesagWS",
            "password": "Dispro2607!"
        }
    })
  };

  try {
      const login = await fetch(`https://dispro360.disprofarma.com.ar/WSDisproConexion/Login.svc/Autenticar`, options);
      let response = await login.json();
      const token = response.token;

      const transfers = await fetch(`https://dispro360.disprofarma.com.ar/WSDisproConexion/Ejecucion.svc/EjecutarProcedimiento`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            tokenAutenticacion: token,
          },
          body: JSON.stringify({ 
              "parametros": {
                  "codigo": "ESTADOTRF", 
                  "datos": [
                      { "nombre": "@lab", "valor": "51"  },
                      { "nombre": "@FecD", "valor": formattedFirstDay  },
                      { "nombre": "@FecH", "valor": formattedLastDay  },
                      { "nombre": "@Grupo", "valor": ""  },
                      { "nombre": "@TipoTRF", "valor": "TODOS"  },
                      { "nombre": "@Estado", "valor": "3"  },            
                      { "nombre": "@Promotor", "valor": "0"  },
                      { "nombre": "@Familia", "valor": ""  },
                      { "nombre": "@NroTRF", "valor": "0"  },
                      { "nombre": "@P_LABUSU", "valor": "0"  }            
                  ]
              }
          })
      });

      const resp = await transfers.json();
      const datos = JSON.parse(resp.datos);
      const final = datos.listado0.map(x => ({
          fecha: x.FechaAlta,
          cantidad: x.CantP,
          drogueria: x.Drogueria,
          producto: x.Descripcion,
          farmacia: x.NombreFarmacia,
          localidad: x.Localidad_Farmacia,
          estado: x.Estado
      }));
      res.send(final);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error en el servidor');
  }
};
