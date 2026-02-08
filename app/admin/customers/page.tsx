import { fetchCustomers } from "../queries";
import { CustomersClient } from "./components/CustomersClient";
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CustomersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const customers = await fetchCustomers();

    return (
        <div className="space-y-8">
            <CustomersClient initialCustomers={customers} />
        </div>
    );
}
