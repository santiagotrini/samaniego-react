import { useState, useRef } from 'react';
import axios from 'axios';

const App = () => {

  const fileInput = useRef(null);


  const handleSubmit = e => {
    e.preventDefault();
    // console.log(fileInput.current.files[0]);
    // console.log(title);
    // const data = {
    //   image: fileInput.current.files[0],
    //   title: title
    // };
    const formData = new FormData();
    formData.append('image', fileInput);
    formData.append('title', title);
    console.log(formData);
    axios.post('/uploads', formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  };

  const [title, setTitle] = useState('');

  return (
    <div>
      <h2>Subi un archivo</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>titulo</label>
        <input
          type="text"
          onChange={e => setTitle(e.target.value)}
          name="title"
        />
        <br />
        <input type="file" ref={fileInput} name="image" />
        <br />
        <input type="submit" value="enviar" />
      </form>
    </div>
  );
};

export default App;
