export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string | null
          country: string | null
          id: number
          postCode: string | null
          street: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          id?: number
          postCode?: string | null
          street?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          id?: number
          postCode?: string | null
          street?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          email: string
          id: number
          name: string
        }
        Insert: {
          email: string
          id?: number
          name: string
        }
        Update: {
          email?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          clientAddressId: number
          clientId: number
          createdAt: string
          description: string
          id: string
          paymentDue: string
          paymentTerms: number
          senderAddressId: number
          status: string | null
          total: number
        }
        Insert: {
          clientAddressId: number
          clientId: number
          createdAt: string
          description: string
          id: string
          paymentDue: string
          paymentTerms: number
          senderAddressId: number
          status?: string | null
          total: number
        }
        Update: {
          clientAddressId?: number
          clientId?: number
          createdAt?: string
          description?: string
          id?: string
          paymentDue?: string
          paymentTerms?: number
          senderAddressId?: number
          status?: string | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_clientaddressid_fkey"
            columns: ["clientAddressId"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_clientid_fkey"
            columns: ["clientId"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_senderaddressid_fkey"
            columns: ["senderAddressId"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          id: number
          invoiceId: string
          name: string
          price: number
          quantity: number
          total: number
        }
        Insert: {
          id?: number
          invoiceId: string
          name: string
          price: number
          quantity: number
          total: number
        }
        Update: {
          id?: number
          invoiceId?: string
          name?: string
          price?: number
          quantity?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "items_invoiceid_fkey"
            columns: ["invoiceId"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_invoice_data: {
        Args: {
          invoice_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
