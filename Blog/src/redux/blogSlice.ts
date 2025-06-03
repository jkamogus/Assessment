import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabaseClient";

export const createPost = createAsyncThunk(
    'blog/createPost',
    async ({ title, content }: { title: string; content: string}) => {
        const { 
            data: { user }, 
            error: userError, 
        } = await supabase.auth.getUser();

        if (userError || !user){
            throw new Error("User not authenticated");         
        }
        const { data, error } = await supabase
        .from('posts')
        .insert([{ title, content, user_id: user.id, username: user.user_metadata?.username || user.email }]);

        if (error) throw error;
        return data;
    }
);

export const fetchPosts = createAsyncThunk(
    "blog/fetchPosts",
    async ({ page, pageSize, userId }: {page: number; pageSize: number, userId: string}) => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", {ascending: false})
        .range(from, to);

    if (error) throw error;

    return { posts: data, page};
    }
);

export const updatePosts = createAsyncThunk(
    "blog/updatePosts",
    async(
        { id, title, content }: { id: number; title: string; content: string },
        { rejectWithValue}
    ) => {
        const { error } = await supabase
        .from("posts")
        .update({ title, content })
        .eq("id", id)
        .select()
        .single();

        if (error) {
            return rejectWithValue(error.message)
        }
        return { id, title, content }
    }

);

export const getPostById = createAsyncThunk(
    "blog/getPostById",
    async (id: number, { rejectWithValue }) => {
        const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

        if (error) return rejectWithValue(error.message);
        return data;
    }
)

export const deletePost = createAsyncThunk(
    "blog/deletePost",
    async (postId: number, { rejectWithValue }) => {
        const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

        if (error) return rejectWithValue(error.message);
        return postId;
    }
);


const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        posts: [] as any[],
        page: 1,
        pageSize: 5,
        hasMore: true,
        loading: false,
        creating: false,
        error: null as string | null,
        selectedPost: null as any | null,
        updating: false
    },
    reducers: {
        setPage(state, action) {
            state.page = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        //Loading Posts in Home Page
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.posts;
                state.page = action.payload.page;
                state.hasMore = action.payload.posts.length === state.pageSize;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load posts';
            })
        //Create Posts
            .addCase(createPost.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.creating = false;
                if(action.payload && Array.isArray(action.payload)) {
                    state.posts.unshift(action.payload[0]);
                }
            })
            .addCase(createPost.rejected, (state, action) => {
                state.creating = false;
                state.error = action.error.message || 'Failed to create post';
            })
            .addCase(updatePosts.pending, (state) => {
                state.updating = true;
            })
            .addCase(updatePosts.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.posts.findIndex(post => post.id === action.payload.id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(updatePosts.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload as string;
            })
            .addCase(getPostById.fulfilled, (state, action) => {
                state.selectedPost = action.payload;
            })
            .addCase(getPostById.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.posts = state.posts.filter(post => post.id !== deletedId);
                if (state.selectedPost?.id === deletedId) {
                    state.selectedPost = null;
                }
                state.error = null;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.error = action.error.message || "Failed to delete blog."
            })
    },
});


export const { setPage } = blogSlice.actions;
export default blogSlice.reducer;