-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    investor_address TEXT NOT NULL,
    num_tokens INTEGER NOT NULL CHECK (num_tokens > 0),
    total_amount DECIMAL(20, 2) NOT NULL CHECK (total_amount > 0),
    transaction_hash TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for querying transactions by investor and property
CREATE INDEX idx_transactions_investor ON transactions(investor_address);
CREATE INDEX idx_transactions_property ON transactions(property_id);

-- Add a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for transaction summaries with property details
CREATE VIEW transaction_summaries AS
SELECT 
    t.*,
    p.title as property_title,
    p.location as property_location,
    p.token_price,
    p.images
FROM transactions t
JOIN properties p ON t.property_id = p.id;

-- Create a function to get investor portfolio summary
CREATE OR REPLACE FUNCTION get_investor_portfolio(investor_addr TEXT)
RETURNS TABLE (
    total_invested DECIMAL(20, 2),
    total_properties INTEGER,
    total_tokens INTEGER,
    properties JSON
) AS $$
BEGIN
    RETURN QUERY
    WITH portfolio AS (
        SELECT 
            property_id,
            SUM(num_tokens) as tokens_owned,
            SUM(total_amount) as amount_invested
        FROM transactions 
        WHERE investor_address = investor_addr 
        AND status = 'completed'
        GROUP BY property_id
    )
    SELECT 
        COALESCE(SUM(p.amount_invested), 0) as total_invested,
        COUNT(DISTINCT p.property_id) as total_properties,
        COALESCE(SUM(p.tokens_owned), 0) as total_tokens,
        COALESCE(
            json_agg(
                json_build_object(
                    'property_id', prop.id,
                    'title', prop.title,
                    'location', prop.location,
                    'tokens_owned', p.tokens_owned,
                    'amount_invested', p.amount_invested,
                    'current_value', (p.tokens_owned * prop.token_price)
                )
            ),
            '[]'::json
        ) as properties
    FROM portfolio p
    JOIN properties prop ON p.property_id = prop.id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get property investment summary
CREATE OR REPLACE FUNCTION get_property_investment_summary(property_id UUID)
RETURNS TABLE (
    total_investors INTEGER,
    total_tokens_sold INTEGER,
    total_amount_raised DECIMAL(20, 2),
    investors JSON
) AS $$
BEGIN
    RETURN QUERY
    WITH investments AS (
        SELECT 
            investor_address,
            SUM(num_tokens) as tokens_owned,
            SUM(total_amount) as amount_invested
        FROM transactions 
        WHERE property_id = $1 
        AND status = 'completed'
        GROUP BY investor_address
    )
    SELECT 
        COUNT(DISTINCT i.investor_address) as total_investors,
        COALESCE(SUM(i.tokens_owned), 0) as total_tokens_sold,
        COALESCE(SUM(i.amount_invested), 0) as total_amount_raised,
        COALESCE(
            json_agg(
                json_build_object(
                    'investor_address', i.investor_address,
                    'tokens_owned', i.tokens_owned,
                    'amount_invested', i.amount_invested,
                    'ownership_percentage', (i.tokens_owned::FLOAT / p.total_tokens * 100)
                )
            ),
            '[]'::json
        ) as investors
    FROM investments i
    CROSS JOIN properties p
    WHERE p.id = $1
    GROUP BY p.total_tokens;
END;
$$ LANGUAGE plpgsql;
