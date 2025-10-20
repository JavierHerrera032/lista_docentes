const fs = require("fs");
const readline = require("readline");
const YAML = require("yaml");

// Crear interfaz de lectura
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const archivo = "docentes.json";

// Leer datos existentes
function leerDocentes() {
  if (fs.existsSync(archivo)) {
    const data = fs.readFileSync(archivo, "utf8").trim();
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.log(" Error leyendo JSON, inicializando lista vacía.");
        return [];
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
}

// Guardar datos
function guardarDocentes(docentes) {
  fs.writeFileSync(archivo, JSON.stringify(docentes, null, 2));
}

// Mostrar lista de docentes
function mostrarDocentes() {
  const docentes = leerDocentes();
  if (docentes.length === 0) {
    console.log("No hay docentes registrados.");
  } else {
    console.log("\n LISTA DE DOCENTES:");
    docentes.forEach((docente, i) => {
      console.log(
        `${i + 1}. ${docente.nombre} | Nº de control: ${docente.numeroControl} | Especialidad: ${docente.especialidad}`
      );
    });
  }
  menu();
}

// Registrar docente
function registrarDocente() {
  rl.question("Nombre completo: ", nombre => {
    rl.question("Número de control: ", numeroControl => {
      rl.question("Especialidad: ", especialidad => {
        const docentes = leerDocentes();
        docentes.push({ nombre, numeroControl, especialidad });
        guardarDocentes(docentes);
        console.log(" Docente registrado correctamente.");
        menu();
      });
    });
  });
}

// Exportar a JSON
function exportarJSON() {
  const docentes = leerDocentes();
  if (docentes.length === 0) {
    console.log("No hay docentes para exportar.");
  } else {
    fs.writeFileSync("listaDocentes.json", JSON.stringify(docentes, null, 2));
    console.log(" Lista de docentes exportada a 'listaDocentes.json'");
  }
  menu();
}

// Exportar a XML
function exportarXML() {
  const docentes = leerDocentes();
  if (docentes.length === 0) {
    console.log("No hay docentes para exportar.");
  } else {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<docentes>\n';
    docentes.forEach(docente => {
      xml += `  <docente>\n`;
      xml += `    <nombre>${docente.nombre}</nombre>\n`;
      xml += `    <numeroControl>${docente.numeroControl}</numeroControl>\n`;
      xml += `    <especialidad>${docente.especialidad}</especialidad>\n`;
      xml += `  </docente>\n`;
    });
    xml += '</docentes>';
    fs.writeFileSync("listaDocentes.xml", xml);
    console.log(" Lista de docentes exportada a 'listaDocentes.xml'");
  }
  menu();
}

// Exportar a YAML
function exportarYAML() {
  const docentes = leerDocentes();
  if (docentes.length === 0) {
    console.log("No hay docentes para exportar.");
  } else {
    const yamlStr = YAML.stringify(docentes);
    fs.writeFileSync("listaDocentes.yaml", yamlStr);
    console.log(" Lista de docentes exportada a 'listaDocentes.yaml'");
  }
  menu();
}

// Menú principal
function menu() {
  console.log("\n===== SISTEMA DE DOCENTES =====");
  console.log("1. Registrar docente");
  console.log("2. Mostrar lista de docentes");
  console.log("3. Salir");
  console.log("4. Exportar lista a archivo JSON");
  console.log("5. Exportar lista a archivo XML");
  console.log("6. Exportar lista a archivo YAML");

  rl.question("Elige una opción: ", opcion => {
    switch (opcion) {
      case "1":
        registrarDocente();
        break;
      case "2":
        mostrarDocentes();
        break;
      case "3":
        console.log("Saliendo del sistema...");
        rl.close();
        break;
      case "4":
        exportarJSON();
        break;
      case "5":
        exportarXML();
        break;
      case "6":
        exportarYAML();
        break;
      default:
        console.log("Opción no válida.");
        menu();
    }
  });
}

menu();
