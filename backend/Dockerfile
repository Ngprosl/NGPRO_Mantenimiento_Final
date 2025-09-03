# Build and run .NET 8 Web API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore as distinct layers
COPY NgproMantenimientos.Api.csproj ./
RUN dotnet restore "NgproMantenimientos.Api.csproj"

# copy rest of the source
COPY . .

# publish
RUN dotnet publish "NgproMantenimientos.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
COPY --from=build /app/publish .
# copy .env if present (optional)
# docker best practice is to use env vars at run time, not copy .env
ENTRYPOINT ["dotnet", "NgproMantenimientos.Api.dll"]
