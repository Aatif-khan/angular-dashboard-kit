/**
 * Generic reusable repository base class mapping CRUD actions to Prisma model delegates.
 */
export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected constructor(protected readonly model: any) {}

  /**
   * Find a record by its unique ID.
   */
  public async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  /**
   * Find the first record matching the search criteria.
   */
  public async findFirst(where: any): Promise<T | null> {
    return this.model.findFirst({
      where,
    });
  }

  /**
   * Find multiple records matching the search criteria.
   */
  public async findMany(params?: {
    skip?: number;
    take?: number;
    cursor?: any;
    where?: any;
    orderBy?: any;
  }): Promise<T[]> {
    return this.model.findMany(params);
  }

  /**
   * Create a new record.
   */
  public async create(data: CreateInput): Promise<T> {
    return this.model.create({
      data,
    });
  }

  /**
   * Update an existing record.
   */
  public async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a record by ID.
   */
  public async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  /**
   * Count the number of records matching the criteria.
   */
  public async count(where?: any): Promise<number> {
    return this.model.count({
      where,
    });
  }
}
