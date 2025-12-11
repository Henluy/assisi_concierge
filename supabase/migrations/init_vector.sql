-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your knowledge base
create table knowledge_vectors (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  metadata jsonb,
  embedding vector(1536) -- OpenAI text-embedding-3-small dimension
);

-- Create a function to search for documents
create or replace function match_knowledge (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_vectors.id,
    knowledge_vectors.content,
    knowledge_vectors.metadata,
    1 - (knowledge_vectors.embedding <=> query_embedding) as similarity
  from knowledge_vectors
  where 1 - (knowledge_vectors.embedding <=> query_embedding) > match_threshold
  order by knowledge_vectors.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create an index for faster search (optional but recommended for production)
create index on knowledge_vectors using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
