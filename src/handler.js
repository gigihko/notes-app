const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = { title, tags, body, id, createdAt, updatedAt };
    notes.push(newNote);

    const isSuccess = notes.some((note) => note.id === id);

    const response = h.response({
        status: isSuccess ? 'success' : 'fail',
        error: false,
        message: isSuccess ? 'Catatan berhasil ditambahkan' : 'Catatan gagal ditambahkan',
        data: isSuccess ? { noteId: id } : undefined,
    });

    response.code(isSuccess ? 201 : 500);
    response.header('Access-Control-Allow-Origin', '*'); // Mengizinkan semua domain

    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: { notes },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const note = notes.find((n) => n.id === id);

    if (note) {
        return { status: 'success', data: { note } };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = { ...notes[index], title, tags, body, updatedAt };

        return h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    }).code(404);
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const index = notes.findIndex((note) => note.id === id);
   
    if (index !== -1) {
      notes.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil dihapus',
      });
      response.code(200);
      return response;
    }
   
  const response = h.response({
      status: 'fail',
      message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};
