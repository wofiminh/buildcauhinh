Sequel.migration do
  change do
    extension :pg_enum
    create_enum(:cpu_type, %w[intel amd])
    create_enum(:price_type, %w[under_7 between_7_12 between_13_20 above_20])

    create_table(:builds) do
      primary_key :id
      Integer :user_id, null: false, index: true
      String :slug, fixed: true, null: false, index: { unique: true }
      String :title, fixed: true, null: false
      price_type :price_type, null: false
      cpu_type :cpu_type, null: false
      TrueClass :price_showed, null: false, default: true
      TrueClass :provider_showed, null: false, default: false
      DateTime :created_at
      DateTime :updated_at
    end
  end
end
