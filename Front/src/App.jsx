import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Service from './Service/Service';
function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [nameFile, setNameFile] = useState('Arrastra tu imagen acá');
  const [imagen, setImagen] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [adulto, setAdulto] = useState(0);
  const [parodia, setParodia] = useState(0);
  const [medico, setMedico] = useState(0);
  const [violencia, setViolencia] = useState(0);
  const [picante, setPicante] = useState(0);
  const [rostros, setRostros] = useState(0);
  const [blur, setBlur] = useState(false);
  const [caras, setCaras] = useState([]);
  const [mensaje, setMensaje] = useState(false);
  const [aceptado, setAceptado] = useState(false);

  const canvasRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (file && allowedTypes.includes(file.type)) {
      console.log('Archivo cargado:', file);
      setNameFile(file.name);
      setImagen(file);
      setBlur(false);
      setCaras([]);
      setAdulto(0);
      setParodia(0);
      setMedico(0);
      setViolencia(0);
      setPicante(0);
      setRostros(0);
      setMensaje(false);
      fileToBase64(file)
      .then((result) => {
        setImageSrc(result);
      })
    } else {
      toast.error('El archivo seleccionado no es válido. Por favor, selecciona un archivo de tipo .png o .jpg.');
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (file && allowedTypes.includes(file.type)) {
      setNameFile(file.name);
      setImagen(file);
      console.log('Archivo cargado:', file);
      setBlur(false);
      setCaras([]);
      setAdulto(0);
      setParodia(0);
      setMedico(0);
      setViolencia(0);
      setPicante(0);
      setRostros(0);
      setMensaje(false);
      fileToBase64(file)
      .then((result) => {
        setImageSrc(result);
      })
    } else {
      toast.error('El archivo seleccionado no es válido. Por favor, selecciona un archivo de tipo .png o .jpg.',
      {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  const AnalizarImagen = () => {
    const fd = new FormData();
    fd.append('file', imagen);
    Service.analizar(fd)
    .then((response) => {
      console.log(response);
      const data = response.data;
      setRostros(data.cantidad_caras);
      const contenido = data.contenido;
      setAdulto(contenido.adulto);
      setParodia(contenido.parodia);
      setMedico(contenido.medico);
      setViolencia(contenido.violencia);
      setPicante(contenido.picante);
      if(contenido.violencia > 59){
        setBlur(true);
      }else if(contenido.picante > 50){
        setBlur(true);
      }else if(contenido.adulto > 40){
        setBlur(true);
      }else{
        setBlur(false);
      }
      const sumatoria = contenido.violencia + contenido.picante +  contenido.adulto;
      if(sumatoria > 45){
        setMensaje(true);
        setAceptado(false);
      }else{
        setMensaje(true);
        setAceptado(true);
      }
      const caras = data.caras;
      setCaras(caras);
      setCuadros(data.caras);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    if(imageSrc){
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        if (blur) {
          ctx.filter = "blur(5px)";
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = "none";
        }
        caras.forEach(cara => {
          const cuadro = cara.cuadro;
          ctx.strokeStyle = 'green';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cuadro[0].x, cuadro[0].y);
          for (let i = 1; i < 4; i++) {
            ctx.lineTo(cuadro[i].x, cuadro[i].y);
          }
          ctx.closePath();
          ctx.stroke();
        });
      };
    }
  }, [imageSrc, blur, caras]);

  return (
    <>
    <Toaster
    position="bottom-center"
    reverseOrder={false}/>
      <nav class="bg-gray-800 border-gray-200">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <span class="self-center text-xl font-semibold whitespace-nowrap text-white">
              Práctica 1
            </span>
          </div>
          <div class="flex items-center space-x-3 rtl:space-x-reverse flex-grow justify-center">
            <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">
              Image-Analyzer
            </span>
          </div>
          <div class="flex items-center space-x-3 rtl:space-x-reverse">
            <span class="self-center text-xl font-semibold whitespace-nowrap text-white">
              Inteligencia Artificial 1
            </span>
          </div>
        </div>
      </nav>
      <div class="min-h-screen flex flex-col">
        <div class="flex-1 flex">
          <div class="w-1/4 bg-blue-500 p-4 overflow-y-auto">
            <h1 className="font-semibold text-white text-xl mb-3">Cargar Imagen:</h1>
            <div
              className="bg-gray-50 text-center px-4 rounded w-80 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-400 border-dashed mx-auto font-[sans-serif]"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="py-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 mb-2 fill-gray-600 inline-block" viewBox="0 0 32 32">
                  <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" data-original="#000000"/>
                  <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" data-original="#000000"/>
                </svg>
                <h4 className="text-base font-semibold text-gray-600 whitespace-nowrap overflow-ellipsis">{nameFile}</h4>
              </div>
              <hr className="w-full border-gray-400 my-2" />
              <div className="py-6 ">
                <input type="file" id="uploadFile1" className="hidden" accept=".jpg,.png"  onChange={handleFileUpload} />
                <label htmlFor="uploadFile1" className="block px-6 py-2.5 rounded text-gray-600 text-sm tracking-wider font-semibold border-none outline-none bg-gray-200 hover:bg-gray-100">Busca en tus archivos</label>
                <p className="text-xs text-gray-400 mt-4">Unicamente se acepta .png y .jpg</p>
              </div>
            </div>
            <button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-3 ml-3" onClick={AnalizarImagen}>Analizar Imagen</button>
            <h1 className="font-semibold text-white text-xl mt-3">Resultados:</h1>
            {mensaje && (
              <>
              {aceptado ? (
                <div class="mx-auto flex justify-center items-center mt-3">
                  <a class="block max-w-sm p-6 bg-green-700 border border-gray-200 rounded-lg shadow hover:bg-gray-100  dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-white text-center">Imagen valida</h5>
                  </a>
                </div>
              ):(
                <div class="mx-auto flex justify-center items-center mt-3">
                  <a class="block max-w-sm p-6 bg-red-700 border border-gray-200 rounded-lg shadow hover:bg-gray-100  dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-white text-center">Imagen NO apta para la institución</h5>
                  </a>
                </div>
              
              )
              }
              </>
            )}
            <div class="mx-auto flex justify-center items-center mt-3">
              <a class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                  <h5 class="mb-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Cantidad de rostros</h5>
                  <p class="font-bold text-white items-center justify-center text-center text-3xl">{rostros}</p>
              </a>
            </div>
            <div className="mt-3">
              <div class="mb-1 text-lg font-medium dark:text-white">Adulto</div>
              <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div class="bg-green-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: adulto + '%' }}>{adulto + '%'}</div>
              </div>
              <div class="mb-1 text-lg font-medium dark:text-white">Parodia</div>
              <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div class="bg-purple-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: parodia + '%' }}>{parodia + '%'}</div>
              </div>
              <div class="mb-1 text-lg font-medium dark:text-white">Médico</div>
              <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div class="bg-teal-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: medico + '%' }}>{medico + '%'}</div>
              </div>
              <div class="mb-1 text-lg font-medium dark:text-white">Violencia</div>
              <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div class="bg-red-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: violencia + '%' }}>{violencia + '%'}</div>
              </div>
              <div class="mb-1 text-lg font-medium dark:text-white">Picante</div>
              <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div class="bg-orange-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: picante + '%' }}>{picante + '%'}</div>
              </div>
            </div>
          </div>
          <div class="flex-1 bg-gray-900 p-4 relative">
            {imageSrc ? (
              <canvas ref={canvasRef} className="m-3 object-cover w-full" />
            ) : (
              <div class="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                Tienes que cargar una imagen
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
