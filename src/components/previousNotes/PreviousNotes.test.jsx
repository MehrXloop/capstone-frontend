import {render,screen} from '@testing-library/react'
import Notes from './Notes'
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
    rest.get('http://localhost:8086/notes/all', (req, res, ctx) => {
        const notes = [
            {content: 'Note 1'},
            {content: 'Note 2'}
        ];
        return res(ctx.json(notes));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('testing notes component', ()=>{
    test('it renders the note content correctly',async()=>{
        render(<Notes/>);
        const notes = await screen.findAllByRole('listitem')
        expect(notes).toHaveLength(2)
    })
})