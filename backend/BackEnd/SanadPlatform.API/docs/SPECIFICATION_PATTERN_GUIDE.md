# Specification Pattern Guide

This project implements the **Specification Pattern** to encapsulate query logic (filtering, sorting, and including related data) into reusable, testable classes. This guide explains how to use the generic infrastructure located in `Common/Specifications`.

---

## 1. What is a Specification?
A Specification is a class that defines **how** to fetch data. It replaces complex LINQ queries inside your Repositories with a clean, descriptive name.

Instead of writing:
`_context.Patients.Include(p => p.User).Where(p => p.City == "Tunis").ToListAsync()`

You write:
`_repository.ListAsync(new PatientsByCitySpecification("Tunis"))`

---

## 2. How to Create a Specification

Inherit from `BaseSpecification<T>` inside your feature's folder.

```csharp
// Features/Patients/Specifications/PatientWithRewardsSpecification.cs
public class PatientWithRewardsSpecification : BaseSpecification<Patient>
{
    public PatientWithRewardsSpecification(Guid userId) 
        : base(p => p.UserId == userId) // This sets the 'Criteria' (Where clause)
    {
        // Add related data to JOIN
        AddInclude(p => p.User);
        
        // You can add complex joins
        // AddInclude(p => p.PatientRewards);

        // Add sorting
        AddOrderByDescending(p => p.CreatedAt);
    }
}
```

---

## 3. How to use it in a Repository

To make your Repository support specifications, you need an **Evaluator** that applies the spec to an `IQueryable`.

### Step A: Create the Evaluator (One-time setup)
Create this in `Common/Specifications/SpecificationEvaluator.cs`:

```csharp
public static class SpecificationEvaluator<T> where T : class
{
    public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T> spec)
    {
        var query = inputQuery;

        if (spec.Criteria != null)
            query = query.Where(spec.Criteria);

        query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

        if (spec.OrderBy != null)
            query = query.OrderBy(spec.OrderBy);
        else if (spec.OrderByDescending != null)
            query = query.OrderByDescending(spec.OrderByDescending);

        if (spec.IsPagingEnabled)
            query = query.Skip(spec.Skip).Take(spec.Take);

        return query;
    }
}
```

### Step B: Call it from your Repository
```csharp
public async Task<List<Patient>> ListAsync(ISpecification<Patient> spec)
{
    return await SpecificationEvaluator<Patient>
        .GetQuery(_context.Patients.AsQueryable(), spec)
        .ToListAsync();
}
```

---

## 4. Using the PredicateBuilder
For advanced filtering (like Search bars where multiple fields might be optional), use the `PredicateBuilder` in `Common/Utilities`.

```csharp
public class SearchProvidersSpecification : BaseSpecification<Provider>
{
    public SearchProvidersSpecification(string? city, string? serviceType)
    {
        var criteria = PredicateBuilder.True<Provider>();

        if (!string.IsNullOrEmpty(city))
            criteria = criteria.And(p => p.City == city);

        if (!string.IsNullOrEmpty(serviceType))
            criteria = criteria.And(p => p.ServiceCategory == serviceType);

        Criteria = criteria;
    }
}
```

---

## 5. Benefits for Vertical Slice Architecture
1.  **Isolation**: The "Search logic" for Providers stays inside the Providers folder.
2.  **Clean Controllers/Handlers**: Your MediatR handler just passes parameters into a Specification constructor.
3.  **Testability**: You can Unit Test a Specification class without needing a database to ensure the logic is correct.
