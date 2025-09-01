import { adminDb } from '@/app/utils/firebase/firebaseAdmin';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// export async function GET(req, { params }) {
//   try {
//     const uid = cookies().get('uid')?.value;
//     if (!uid) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { id } = params; // Fixed: No await needed
//     if (!id) {
//       return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
//     }

//     const todoRef = adminDb.collection('users').doc(uid).collection('todos').doc(id);
//     const todoDoc = await todoRef.get(); // Fixed: Await get() and use todoDoc
//     if (!todoDoc.exists) {
//       return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
//     }

//     const todo = { id: todoDoc.id, ...todoDoc.data() };
//     console.log('Fetched todo:', todo);
//     return NextResponse.json(todo); // Fixed: Return todo directly
//   } catch (err) {
//     console.error('Error fetching todo:', err.message, err.stack);
//     return NextResponse.json({ error: 'Error fetching todo', details: err.message }, { status: 500 });
//   }
// }

export async function PUT(req, { params }) {
  try {
    const uid = cookies().get('uid')?.value;
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; 
    if (!id) {
      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
    }

    const { title, completed } = await req.json();
    if (!title && completed === undefined) {
      return NextResponse.json({ error: 'At least one field (title or completed) is required' }, { status: 400 });
    }

    const todoRef = adminDb.collection('users').doc(uid).collection('todos').doc(id);
    const todoDoc = await todoRef.get(); 
    if (!todoDoc.exists) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const updateData = {};
    if (title && typeof title === 'string' && title.trim() !== '') {
      updateData.title = title;
    }
    if (typeof completed === 'boolean') {
      updateData.completed = completed;
    }

    await todoRef.update(updateData); 
    console.log('Updated todo:', id);
    return NextResponse.json({ id, ...updateData });
  } catch (err) {
    console.error('Error updating todo:', err.message, err.stack);
    return NextResponse.json({ error: 'Error updating todo', details: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const uid = cookies().get('uid')?.value;
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; 
    if (!id) {
      return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
    }

    const todoRef = adminDb.collection('users').doc(uid).collection('todos').doc(id);
    const todoDoc = await todoRef.get(); 
    if (!todoDoc.exists) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    await todoRef.delete(); 
    console.log('Deleted todo:', id);
    return NextResponse.json({ id });
  } catch (err) {
    console.error('Error deleting todo:', err.message, err.stack);
    return NextResponse.json({ error: 'Error deleting todo', details: err.message }, { status: 500 });
  }
}